import { Octokit } from "@octokit/rest";
import path from "path";
import { fileURLToPath } from "url";
import { createObjectCsvWriter } from "csv-writer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __data_dir = path.resolve(__dirname, '../data');

const octokit = new Octokit({});

async function getCommits(owner, repo) {
    try {
        const { data } = await octokit.repos.listCommits({
            owner,
            repo,
            // per_page: 100 // TODO Do I need that? (default is 30, 100 is max)
        });

        const commits = data.map(commit => ({
            sha: commit.sha,
            timestamp: commit.commit.author.date
        }));

        return commits;
    } catch (error) {
        throw new Error(`Error fetching commits: ${error.message}`);
    }
}

async function getCommitFiles(owner, repo, sha) {
    try {
        const { data } = await octokit.repos.getCommit({
            owner,
            repo,
            ref: sha
        });
        return data.files;
    } catch (error) {
        throw new Error(`Error fetching commit files: ${error.message}`);
    }
}

async function writeCsv(data, outputPath) {
    const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: [
            { id: 'fileName', title: 'fileName' },
            { id: 'timestamp', title: 'timestamp' },
            { id: 'linesOfCode', title: 'linesOfCode' },
            { id: 'dummyAttribute1', title: 'dummyAttribute1' },
            { id: 'dummyAttribute2', title: 'dummyAttribute2' },
            { id: 'dummyAttribute3', title: 'dummyAttribute3' },
            { id: 'dummyAttribute4', title: 'dummyAttribute4' }
        ]
    });

    await csvWriter.writeRecords(data);
    console.log(`CSV file written successfully to ${outputPath}`);
}

(async () => {
    const owner = "jonaslanzlinger";
    const repo = "dummy-java-project-software-city";
    const outputPath = path.join(__data_dir, `${owner}__${repo}.csv`);

    try {
        const commits = await getCommits(owner, repo);
        let commitData = [];

        for (const [index, commit] of commits.entries()) {
            let files = await getCommitFiles(owner, repo, commit.sha);

            files = files.filter(file => file.filename.endsWith('.java'));

            console.log(files);

            files = files.map(file => ({
                filename: file.filename.replace('.java', '').replace(/\//g, '.'),
                changes: file.changes
            }));

            files.forEach(file => {
                commitData.push({
                    fileName: file.filename,
                    timestamp: commit.timestamp,
                    linesOfCode: file.changes,
                    dummyAttribute1: 'dummyValue1',
                    dummyAttribute2: 'dummyValue2',
                    dummyAttribute3: 'dummyValue3',
                    dummyAttribute4: 'dummyValue4'
                });
            });
        }

        await writeCsv(commitData, outputPath);
    } catch (error) {
        console.error(error);
    }
})();
