import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import sloc from "sloc";
import madge from "madge";
import { excludedDirectories } from "./compute-metrics-config.js";

function getAllFiles(dirPath, arrayOfFiles) {
   arrayOfFiles = arrayOfFiles || [];

   const files = fs.readdirSync(dirPath);

   files.forEach(function (file) {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
         // if the directory is any of the excluded directories, skip it
         if (excludedDirectories.some((dir) => filePath.includes(dir))) {
            return;
         }
         arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      } else {
         if (path.extname(file) === ".js") {
            arrayOfFiles.push(filePath);
         }
      }
   });

   return arrayOfFiles;
}

function transpileFile(filePath, transpiledPath) {
   try {
      const originalDir = path.dirname(transpiledPath);
      const relativeFilePath = path.relative(originalDir, filePath);
      const outputFilePath = path.join(transpiledPath, relativeFilePath);
      execSync(
         `npx babel ${filePath} -o ${outputFilePath} --presets=@babel/preset-env`,
         { encoding: "utf8", stdio: "pipe" }
      );
      return outputFilePath;
   } catch (error) {
      console.error(
         `Error transpiling file: ${filePath} - Metrics will be set to the values of the previous valid commit.`
      );
      return null;
   }
}

function analyzeSloc(transpiledFilePath) {
   const fileContent = fs.readFileSync(transpiledFilePath, "utf8");
   const stats = sloc(fileContent, "js");
   return stats;
}

function analyzeComplexity(transpiledFilePath) {
   try {
      const result = execSync(
         `npx complexity-report -f json ${transpiledFilePath}`,
         {
            encoding: "utf8",
         }
      );
      const metrics = JSON.parse(result);
      return metrics;
   } catch (error) {
      console.error(
         `Error analyzing file: ${transpiledFilePath}`,
         error.message
      );
      return null;
   }
}

async function analyzeDependenciesSync(repoPath) {
   try {
      const result = madge(repoPath).then((res) => res.obj());
      return result;
   } catch (error) {
      console.error("Error analyzing dependencies:", error.message);
      return null;
   }
}

async function transpileFiles(repoPath) {
   const transpiledPath = path.join(repoPath, "transpiled");

   if (!fs.existsSync(transpiledPath)) {
      fs.mkdirSync(transpiledPath);
   }

   const files = getAllFiles(repoPath);

   let analysisResults = files.map((filePath) => {
      const transpiledFilePath = transpileFile(filePath, transpiledPath);

      // set the filePath to the relative path from the repository root directory
      const relativeFilePath = path.relative(repoPath, filePath);

      if (!transpiledFilePath) {
         return {
            filePath: relativeFilePath,
            slocTotal: null,
            slocSource: null,
            loc: null,
            cyclomatic: null,
            effort: null,
            params: null,
            maintainability: null,
            dependencies: 0,
         };
      }

      const slocStats = analyzeSloc(transpiledFilePath);
      const complexityMetrics = analyzeComplexity(transpiledFilePath);

      return {
         filePath: relativeFilePath,
         slocTotal: slocStats?.total,
         slocSource: slocStats?.source,
         loc: complexityMetrics?.loc,
         cyclomatic: complexityMetrics?.cyclomatic,
         effort: complexityMetrics?.effort,
         params: complexityMetrics?.params,
         maintainability: complexityMetrics?.maintainability,
         dependencies: 0,
      };
   });

   const dependencies = await analyzeDependenciesSync(transpiledPath);

   analysisResults = analysisResults.map((result) => {
      const dependenciesCount = dependencies[result.filePath]?.length || 0;
      return { ...result, dependencies: dependenciesCount };
   });

   return analysisResults;
}

function removeTranspiledFiles(repoPath) {
   const transpilePath = path.join(repoPath, "transpiled");
   if (fs.existsSync(transpilePath)) {
      fs.rmSync(transpilePath, { recursive: true, force: true });
   }
}

export { transpileFiles, removeTranspiledFiles };
