import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import util from "util";
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
  const start = new Date();

  const { repoName } = req.body;
  const originalDir = process.cwd();

  const repoDirName = repoName.split("/").slice(-1)[0];
  const repoPath = path.join(originalDir, "temp_repositories", repoDirName);

  try {
    if (fs.existsSync(repoPath)) {
      console.log(`Removing existing directory: ${repoPath}`);
      fs.rmSync(repoPath, { recursive: true, force: true });
    }

    if (!fs.existsSync(path.join(originalDir, "temp_repositories"))) {
      fs.mkdirSync(path.join(originalDir, "temp_repositories"), {
        recursive: true,
      });
    }

    process.chdir(path.join(originalDir, "temp_repositories"));
    const gitCloneCommand = `git clone https://github.com/${repoName}.git`;
    console.log(`Cloning repository: ${gitCloneCommand}`);
    await execAsync(gitCloneCommand);
    console.log(`Repository cloned successfully`);

    process.chdir(repoPath);
    const gitLogCommand = `git log --pretty=%H`;
    console.log(`Getting commit hashes: ${gitLogCommand}`);
    const { stdout: commitHashes } = await execAsync(gitLogCommand);
    const commitHashList = commitHashes.split("\n").filter(Boolean);
    console.log(`Commit hashes: ${commitHashList}`);

    // loop through each commit hash
    // and calculate the number of lines of each file
    for (const commitHash of commitHashList) {
      const gitCheckoutCommand = `git checkout ${commitHash}`;
      console.log(`Checking out commit: ${gitCheckoutCommand}`);
      await execAsync(gitCheckoutCommand);

      const gitLsFilesCommand = `git ls-files`;
      console.log(`Getting list of files: ${gitLsFilesCommand}`);
      const { stdout: fileNames } = await execAsync(gitLsFilesCommand);
      const fileNameList = fileNames.split("\n").filter(Boolean);
      console.log(`Files: ${fileNameList}`);

      for (const fileName of fileNameList) {
        const gitShowCommand = `git show ${commitHash}:${fileName}`;
        console.log(`Getting file content: ${gitShowCommand}`);
        const { stdout: fileContent } = await execAsync(gitShowCommand);

        const lines = fileContent.split("\n").filter(Boolean);
        console.log(`File: ${fileName}, Lines: ${lines.length}`);
      }
    }

    process.chdir(originalDir);

    console.log(`Duration: ${new Date() - start}ms`);

    res.send("Repository metrics calculated successfully");
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
