import { Octokit } from "@octokit/rest";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const octokit = new Octokit({});

async function getRepoDetails(owner, repo) {
    try {
        const { data } = await octokit.repos.get({
            owner,
            repo
        });
        console.log(`Repository: ${data.full_name}`);
        console.log(`Description: ${data.description}`);
        console.log(`Stars: ${data.stargazers_count}`);
        console.log(`Forks: ${data.forks_count}`);
        console.log(`Open Issues: ${data.open_issues_count}`);
    } catch (error) {
        throw new Error(`Error fetching repository details: ${error.message}`);
    }
}

async function downloadRepo(owner, repo) {
    const repoPath = path.join(__dirname, repo);

    if (fs.existsSync(repoPath)) {
        console.log(`Removing existing directory: ${repoPath}`);
        fs.rmSync(repoPath, { recursive: true, force: true });
    }

    console.log(`Cloning ${owner}/${repo}...`);
    await new Promise((resolve, reject) => {
        exec(`git clone https://github.com/${owner}/${repo}.git`, (err, stdout, stderr) => {
            if (err) {
                reject(`Error cloning repository: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });

    console.log(`Repository ${owner}/${repo} cloned.`);
    return repoPath;
}

async function analyzeRepo(repoPath) {
    console.log(`Analyzing ${repoPath}...`);
    const result = await new Promise((resolve, reject) => {
        exec(`npx cloc ${repoPath} --json`, (err, stdout, stderr) => {
            if (err) {
                reject(`Error running cloc: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });

    return JSON.parse(result);
}

(async () => {
    const owner = "jonaslanzlinger";
    const repo = "software-city-project";

    try {
        await getRepoDetails(owner, repo);
        const repoPath = await downloadRepo(owner, repo);
        console.log("Repository downloaded to:", repoPath);
        const analysis = await analyzeRepo(repoPath);

        console.log("Lines of Code:", analysis);
    } catch (error) {
        console.error(error);
    }
})();