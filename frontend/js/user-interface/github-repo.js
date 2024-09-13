import {uploadData} from "./upload.js";
import {createCsvFile, jsonToCsv} from "../utils.js";

const frameGitHubRepo = document.getElementById("frame-github-repo");
const gitHubRepoUrl = document.getElementById("github-repo-url");
const gitHubRepoToken = document.getElementById("github-repo-token");
const buttonFetch = document.getElementById("button-fetch");
const gitHubRepoRegisteredContainer = document.getElementById("github-repo-registered-container");
const buttonCloseFrameGitHubRepo = document.getElementById("frame-github-repo-button-close");

const showFrameGitHubRepo = (show) => {
    if (show) {
        frameGitHubRepo.style.display = "block";
        startFetching();
    } else {
        frameGitHubRepo.style.display = "none";
        stopFetching();
    }
}

const toggleFrameGitHubRepo = () => {
    showFrameGitHubRepo(frameGitHubRepo.style.display === "none" || frameGitHubRepo.style.display === "");
}

buttonCloseFrameGitHubRepo.addEventListener("click", () => {
    showFrameGitHubRepo(false);
});

function toggleFetchButton() {
    buttonFetch.disabled = !gitHubRepoUrl.value;
}

gitHubRepoUrl.addEventListener("input", () => {
    toggleFetchButton();
});

const fetchGitHubRepoRegistered = async () => {
    fetch('http://localhost:8080/api/repo/all')
        .then(response => response.json())
        .then(data => {

            while (gitHubRepoRegisteredContainer.firstChild) {
                gitHubRepoRegisteredContainer.removeChild(gitHubRepoRegisteredContainer.firstChild);
            }

            data.forEach(repo => {
                const row = document.createElement('div');
                row.uuid = repo.uuid;
                row.classList.add('table-row');

                const repoUrlDiv = document.createElement('div');
                repoUrlDiv.textContent = repo.repoUrl;
                row.appendChild(repoUrlDiv);

                const statusIcon = document.createElement('i');
                statusIcon.classList.add('github-status-icon');
                statusIcon.classList.add('material-symbols-outlined');

                if (repo.status.toLowerCase() === 'running') {
                    statusIcon.textContent = 'hourglass_empty';
                } else if (repo.status.toLowerCase() === 'done') {
                    statusIcon.textContent = 'check_circle';
                } else if (repo.status.toLowerCase() === 'failed') {
                    statusIcon.textContent = 'error';
                } else if (repo.status.toLowerCase() === 'queued') {
                    statusIcon.textContent = 'sort';
                } else if (repo.status.toLowerCase() === 'registered') {
                    statusIcon.textContent = 'edit_square';
                }

                row.appendChild(statusIcon);

                if (repo.status.toLowerCase() === 'done') {
                    row.addEventListener('click', () => {

                        fetch(`http://localhost:8080/api/repo/metrics?uuid=${repo.uuid}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(data => {
                                data.metrics.forEach(metric => {
                                    metric.repoUrl = data.repoUrl;
                                });
                                const csvString = jsonToCsv(data.metrics);
                                const file = createCsvFile(csvString);
                                uploadData(file);

                                showFrameGitHubRepo(false);
                            })
                            .catch(error => {
                                console.error('There was a problem with the fetch operation:', error);
                            });

                    });
                }

                gitHubRepoRegisteredContainer.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching repos:', error));
};

let intervalId = null;

const startFetching = () => {
    intervalId = setInterval(async function () {
        await fetchGitHubRepoRegistered();
    }, 1000);
}

const stopFetching = () => {
    clearInterval(intervalId);
}

buttonFetch.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!gitHubRepoUrl.value) { return; }

    try {
        const encodedRepoUrl = encodeURIComponent(gitHubRepoUrl.value);
        if (gitHubRepoToken.value) {
            const encodedRepoToken = encodeURIComponent(gitHubRepoToken.value);
            await fetch(`http://localhost:8080/api/repo/add?repoUrl=${encodedRepoUrl}&token=${encodedRepoToken}`);
        } else {
            await fetch(`http://localhost:8080/api/repo/add?repoUrl=${encodedRepoUrl}&token=`);
        }
        gitHubRepoUrl.value = "";
        gitHubRepoToken.value = "";
    } catch (error) {
        console.error('Error adding repo:', error);
    }
});

export { showFrameGitHubRepo, toggleFrameGitHubRepo, toggleFetchButton };