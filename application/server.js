import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import util from "util";
import { transpileFiles, removeTranspiledFiles } from "./transpileFiles.js";
import { excludedDirectories } from "./computeMetricsConfig.js";
import { Commit } from "./Commit.js";
import { GenericMetricLine } from "./GenericMetricLine.js";
import { formatDateToTimestamp, formatFilename } from "./js/utils.js";
import { writeCommitMetricsToFile } from "./metricFileWriter.js";
const execAsync = util.promisify(exec);

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/getRepositories", (req, res) => {
   res.send(gitHubRepositoryList);
});

app.post("/api/registerRepository", (req, res) => {
   const data = req.body;
   gitHubRepositoryList.push(data.repoName);
   res.send("Repository registered successfully");
});

app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.delete("/api/clearRepositories", (req, res) => {
   gitHubRepositoryList = [];
   res.send("All repositories cleared successfully");
});

app.post("/api/calculateMetrics", async (req, res) => {
   // Start timer
   const start = new Date();

   const { repoName } = req.body;
   const originalDir = process.cwd();

   const repoDirName = repoName.split("/").slice(-1)[0];
   const repoPath = path.join(originalDir, "temp_repositories", repoDirName);

   // Check if the repository directory exists and remove it
   try {
      if (fs.existsSync(repoPath)) {
         console.log(`Removing existing directory: ${repoPath}`);
         fs.rmSync(repoPath, { recursive: true, force: true });
      }

      // Create the repository directory if it does not exist
      if (!fs.existsSync(path.join(originalDir, "temp_repositories"))) {
         fs.mkdirSync(path.join(originalDir, "temp_repositories"), {
            recursive: true,
         });
      }

      // Clone the repository
      process.chdir(path.join(originalDir, "temp_repositories"));
      const gitCloneCommand = `git clone https://github.com/${repoName}.git`;
      console.log(`Cloning repository: ${gitCloneCommand}`);
      await execAsync(gitCloneCommand);
      console.log(`Repository cloned successfully`);

      // Get the list of commit hashes and the respective timestamps of the commits
      process.chdir(repoPath);
      const gitLogCommand = `git log --pretty=format:"%H %at" --reverse`;
      console.log(`Getting commit hashes and timestamps: ${gitLogCommand}`);
      const { stdout: commitList } = await execAsync(gitLogCommand);
      const commits = commitList
         .split("\n")
         .filter(Boolean)
         .map((line) => {
            return new Commit(
               line.split(" ")[0],
               formatDateToTimestamp(
                  new Date(parseInt(line.split(" ")[1]) * 1000)
               )
            );
         });
      console.log(`Commits: ${commits.length}`);

      // Calculate the metrics for all individual commits
      // and write the results to a file
      const csvFileName = `${repoName.split("/")[1]}_metrics.csv`;
      console.log(`Writing metrics to file: ${csvFileName}`);

      let previousCommit = null;

      for (const commit of commits) {
         const gitCheckoutCommand = `git checkout ${commit.commitHash}`;
         await execAsync(gitCheckoutCommand);

         // Transpile the JavaScript files in this commit and
         // store the transpiled files in a separate directory "transpiled"
         const metrics = transpileFiles(repoPath);
         removeTranspiledFiles(repoPath);

         const gitLsFilesCommand = `git ls-files`;
         const { stdout: fileNames } = await execAsync(gitLsFilesCommand);

         // For now, only consider JavaScript files
         // and exclude files in the node_modules directory or the dist directory
         // (or any other directory that is stored in the array 'excludedDirectories')
         const fileNameList = fileNames
            .split("\n")
            .filter(Boolean)
            .filter((fileName) => fileName.endsWith(".js"))
            .filter(
               (fileName) =>
                  !excludedDirectories.some((dir) => fileName.includes(dir))
            );

         // Add the property names for the commit
         commit.addPropertyName("fileName");
         commit.addPropertyName("slocTotal");
         commit.addPropertyName("slocSource");
         commit.addPropertyName("loc");
         commit.addPropertyName("cyclomatic");
         commit.addPropertyName("effort");
         commit.addPropertyName("params");
         commit.addPropertyName("maintainability");

         for (const fileName of fileNameList) {
            // Retrieve the metrics for the current file
            const currentFileMetrics = metrics.find(
               (file) => file.filePath === fileName
            );

            // Create a new metric line for each file
            let metricLine = new GenericMetricLine(commit);

            // Add the file name to the metric line
            metricLine.addProperty(formatFilename(fileName));

            // SLOC total
            if (currentFileMetrics.slocTotal !== null) {
               metricLine.addProperty(currentFileMetrics.slocTotal);
            } else {
               if (previousCommit !== null) {
                  const previousFileMetrics =
                     previousCommit.getMetricLineByFileName(
                        formatFilename(fileName)
                     );
                  if (previousFileMetrics !== null) {
                     metricLine.addProperty(
                        previousFileMetrics.getPropertyValueByIndex(1)
                     );
                  } else {
                     metricLine.addProperty(0);
                  }
               } else {
                  metricLine.addProperty(0);
               }
            }

            // SLOC source
            if (currentFileMetrics.slocSource !== null) {
               metricLine.addProperty(currentFileMetrics.slocSource);
            } else {
               if (previousCommit !== null) {
                  const previousFileMetrics =
                     previousCommit.getMetricLineByFileName(
                        formatFilename(fileName)
                     );
                  if (previousFileMetrics !== null) {
                     metricLine.addProperty(
                        previousFileMetrics.getPropertyValueByIndex(2)
                     );
                  } else {
                     metricLine.addProperty(0);
                  }
               } else {
                  metricLine.addProperty(0);
               }
            }

            // LOC
            if (currentFileMetrics.loc !== null) {
               metricLine.addProperty(currentFileMetrics.loc);
            } else {
               if (previousCommit !== null) {
                  const previousFileMetrics =
                     previousCommit.getMetricLineByFileName(
                        formatFilename(fileName)
                     );
                  if (previousFileMetrics !== null) {
                     metricLine.addProperty(
                        previousFileMetrics.getPropertyValueByIndex(3)
                     );
                  } else {
                     metricLine.addProperty(0);
                  }
               } else {
                  metricLine.addProperty(0);
               }
            }

            // Cyclomatic complexity
            if (currentFileMetrics.cyclomatic !== null) {
               metricLine.addProperty(currentFileMetrics.cyclomatic);
            } else {
               if (previousCommit !== null) {
                  const previousFileMetrics =
                     previousCommit.getMetricLineByFileName(
                        formatFilename(fileName)
                     );
                  if (previousFileMetrics !== null) {
                     metricLine.addProperty(
                        previousFileMetrics.getPropertyValueByIndex(4)
                     );
                  } else {
                     metricLine.addProperty(0);
                  }
               } else {
                  metricLine.addProperty(0);
               }
            }

            // Effort
            if (currentFileMetrics.effort !== null) {
               metricLine.addProperty(currentFileMetrics.effort);
            } else {
               if (previousCommit !== null) {
                  const previousFileMetrics =
                     previousCommit.getMetricLineByFileName(
                        formatFilename(fileName)
                     );
                  if (previousFileMetrics !== null) {
                     metricLine.addProperty(
                        previousFileMetrics.getPropertyValueByIndex(5)
                     );
                  } else {
                     metricLine.addProperty(0);
                  }
               } else {
                  metricLine.addProperty(0);
               }
            }

            // Params
            if (currentFileMetrics.params !== null) {
               metricLine.addProperty(currentFileMetrics.params);
            } else {
               if (previousCommit !== null) {
                  const previousFileMetrics =
                     previousCommit.getMetricLineByFileName(
                        formatFilename(fileName)
                     );
                  if (previousFileMetrics !== null) {
                     metricLine.addProperty(
                        previousFileMetrics.getPropertyValueByIndex(6)
                     );
                  } else {
                     metricLine.addProperty(0);
                  }
               } else {
                  metricLine.addProperty(0);
               }
            }

            // Maintainability
            if (currentFileMetrics.maintainability !== null) {
               metricLine.addProperty(currentFileMetrics.maintainability);
            } else {
               if (previousCommit !== null) {
                  const previousFileMetrics =
                     previousCommit.getMetricLineByFileName(
                        formatFilename(fileName)
                     );
                  if (previousFileMetrics !== null) {
                     metricLine.addProperty(
                        previousFileMetrics.getPropertyValueByIndex(7)
                     );
                  } else {
                     metricLine.addProperty(0);
                  }
               } else {
                  metricLine.addProperty(0);
               }
            }

            // Add the metric line to the commit
            commit.addMetricLine(metricLine);
         }
         console.log(`Commit: ${commit}`);

         writeCommitMetricsToFile(commit, csvFileName);
         console.log(`Metrics written to file: ${csvFileName}`);

         previousCommit = commit;
      }

      process.chdir(originalDir);

      // End timer
      console.log(`Duration: ${new Date() - start}ms`);

      // Send the created file as a response to the client
      res.download(path.join(repoPath, csvFileName), csvFileName, (err) => {
         if (err) {
            console.error("Error downloading the file:", err);
         } else {
            console.log("File download completed.");
            // Remove the repository directory and the created file
            fs.rmSync(repoPath, { recursive: true, force: true });
         }
      });
   } catch (error) {
      process.chdir(originalDir);
      console.error(`Error: ${error.message}`);
      res.status(500).send(`Error: ${error.message}`);
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

let gitHubRepositoryList = [];
