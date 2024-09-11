import {getDataType, clearData, processOriginalData, getDataStore, getOriginalData} from "../data";
import { updateConfig } from "./cookie-manager";
import { uploadData } from "./upload";
import { buildTable } from "./table";
import { prepareMetaphorsFrame } from "./visualize";
import { destroyCity } from "../utils";

const buttonGitHubRepo = document.getElementById("button-github-repo");
const buttonUpload = document.getElementById("button-upload");
const buttonConfig = document.getElementById("button-config");
const buttonMetaphors = document.getElementById("button-metaphors");
const buttonViewData = document.getElementById("button-view-data");
const buttonClearData = document.getElementById("button-clear-data");
const buttonDownloadData = document.getElementById("button-download-data");
const buttonModelTree = document.getElementById("button-model-tree");

const viewData = document.getElementById("view-data");

const frameGitHubRepo = document.getElementById("frame-github-repo");
const frameUpload = document.getElementById("frame-upload");
const frameConfig = document.getElementById("frame-config");
const frameMetaphors = document.getElementById("frame-metaphors");
const frameModelTree = document.getElementById("frame-model-tree");
const frameInfo = document.getElementById("frame-info");

const buttonsClose = document.getElementsByClassName("button-close");

const gitHubRepoUrl = document.getElementById("github-repo-url");
const gitHubRepoRegisteredContainer = document.getElementById("github-repo-registered-container");

const buttonFetch = document.getElementById("button-fetch");
const buttonUploadData = document.getElementById("button-upload-data");
const buttonSaveConfig = document.getElementById("button-save-config");

const sliderValueCopyIcon = document.getElementById("slider-value-copy-icon");

const alertSuccessUploadData = document.getElementById(
   "alert-success-upload-data"
);
const alertSuccessClearData = document.getElementById(
   "alert-success-clear-data"
);
const buttonAlertCloseUploadData = document.getElementById(
   "button-alert-close-upload-data"
);
const buttonAlertCloseClearData = document.getElementById(
   "button-alert-close-clear-data"
);

function toggleFetchButton() {
   buttonFetch.disabled = !gitHubRepoUrl.value;
}

const showFrameGitHubRepo = (show) => {
   if (show) {
      frameGitHubRepo.style.display = "block";
      startFetching();
   } else {
        frameGitHubRepo.style.display = "none";
        stopFetching();
   }
}

gitHubRepoUrl.addEventListener("input", () => {
      toggleFetchButton();
});

buttonGitHubRepo.addEventListener("click", () => {
   frameUpload.style.display = "none";
   frameConfig.style.display = "none";
   frameMetaphors.style.display = "none";
   frameInfo.style.display = "none";
   frameModelTree.style.display = "none";
   if (
      frameGitHubRepo.style.display === "none" ||
      frameGitHubRepo.style.display === ""
   ) {
      showFrameGitHubRepo(true);
   } else {
      showFrameGitHubRepo(false);
   }
});

buttonUpload.addEventListener("click", () => {
   showFrameGitHubRepo(false);
   frameConfig.style.display = "none";
   frameMetaphors.style.display = "none";
   frameInfo.style.display = "none";
   frameModelTree.style.display = "none";
   if (
      frameUpload.style.display === "none" ||
      frameUpload.style.display === ""
   ) {
      frameUpload.style.display = "block";
   } else {
      frameUpload.style.display = "none";
   }
});

buttonConfig.addEventListener("click", () => {
   showFrameGitHubRepo(false);
   frameUpload.style.display = "none";
   frameMetaphors.style.display = "none";
   frameInfo.style.display = "none";
   frameModelTree.style.display = "none";
   if (
      frameConfig.style.display === "none" ||
      frameConfig.style.display === ""
   ) {
      frameConfig.style.display = "block";
   } else {
      frameConfig.style.display = "none";
   }
});

buttonMetaphors.addEventListener("click", () => {
   showFrameGitHubRepo(false);
   frameUpload.style.display = "none";
   frameConfig.style.display = "none";
   frameInfo.style.display = "none";
   frameModelTree.style.display = "none";
   if (
      frameMetaphors.style.display === "none" ||
      frameMetaphors.style.display === ""
   ) {
      frameMetaphors.style.display = "block";
   } else {
      frameMetaphors.style.display = "none";
   }
});

buttonViewData.addEventListener("click", () => {
   showFrameGitHubRepo(false);
   frameUpload.style.display = "none";
   frameConfig.style.display = "none";
   frameMetaphors.style.display = "none";
   frameInfo.style.display = "none";
   destroyCity();
   viewData.style.display = "block";
});

buttonModelTree.addEventListener("click", () => {
   if (
      frameModelTree.style.display === "none" ||
      frameModelTree.style.display === ""
   ) {
      frameModelTree.style.display = "block";
   } else {
      frameModelTree.style.display = "none";
   }
});

buttonClearData.addEventListener("click", () => {
   clearData();
   alertSuccessClearData.style.display = "block";
   $("#alert-success-clear-data").delay(2000).fadeOut(800);
   buildTable();
   toggleConfigAndViewDataButton(true);
   toggleMetaphorsAndModelTreeButton(true);

   document.getElementById("view-data").style.display = "none";

   document.getElementById("instructions").style.display = "block";
});

function convertToCSV(objArray) {
   const array = [Object.keys(objArray[0])].concat(objArray);

   return array.map(it => {
      return Object.values(it).toString();
   }).join('\n');
}

buttonDownloadData.addEventListener("click", () => {
   const data = getOriginalData();
   const csvData = convertToCSV(data);
   const blob = new Blob([csvData], { type: 'text/csv' });
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.setAttribute('hidden', '');
   a.setAttribute('href', url);
   a.setAttribute('download', 'metrics.csv');
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
});

buttonSaveConfig.addEventListener("click", () => {
   let config = null;
   if (getDataType() === "eye-tracking-java-source-code") {
      config = {
         groupingPath: document.getElementById("groupingPath-selection").value,
         timestamp: document.getElementById("timestamp-selection").value,
         participant: document.getElementById("participant-selection").value,
         taskId: document.getElementById("taskId-selection").value,
      };
   } else if (getDataType() === "java-source-code") {
      config = {
         groupingPath: document.getElementById("groupingPath-selection").value,
         timestamp: document.getElementById("timestamp-selection").value,
      };
   }

   updateConfig(config);

   processOriginalData(config);

   prepareMetaphorsFrame();

   alertSuccessUploadData.style.display = "block";
   $("#alert-success-upload-data").delay(2000).fadeOut(800);
   frameConfig.style.display = "none";
   toggleMetaphorsAndModelTreeButton(false);
});

const toggleConfigAndViewDataButton = (boolChoice) => {
   buttonConfig.disabled = boolChoice;
   buttonViewData.disabled = boolChoice;
};

const toggleMetaphorsAndModelTreeButton = (boolChoice) => {
   buttonMetaphors.disabled = boolChoice;
   buttonModelTree.disabled = boolChoice;
};

sliderValueCopyIcon.addEventListener("click", () => {
    document.getElementById('slider-value-copy-icon').style.display = 'none';
    document.getElementById('slider-value-check-icon').style.display = 'block';
    setTimeout(() => {
        document.getElementById('slider-value-copy-icon').style.display = 'block';
        document.getElementById('slider-value-check-icon').style.display = 'none';
    }, 1000);
   const commitHash = document.getElementById("commit-hash");
   commitHash.select();
   commitHash.setSelectionRange(0, 99999);
   navigator.clipboard.writeText(commitHash.value);
});

for (let i = 0; i < buttonsClose.length; i++) {
   buttonsClose[i].addEventListener("click", () => {
      switch (buttonsClose[i].parentElement.id) {
         case "frame-github-repo":
            showFrameGitHubRepo(false);
            break;
         case "frame-upload":
            frameUpload.style.display = "none";
            break;
         case "frame-config":
            frameConfig.style.display = "none";
            break;
         case "frame-metaphors":
            frameMetaphors.style.display = "none";
            break;
         case "frame-info":
            frameInfo.style.display = "none";
            break;
         case "frame-model-tree":
            frameModelTree.style.display = "none";
            break;
      }
   });
}

document.addEventListener("keydown", (e) => {
   if (e.key === "Escape") {
      showFrameGitHubRepo(false);
      frameUpload.style.display = "none";
      frameConfig.style.display = "none";
      frameMetaphors.style.display = "none";
      frameInfo.style.display = "none";
      frameModelTree.style.display = "none";
   }
});

buttonFetch.addEventListener("click", async (e) => {
   e.preventDefault();

   if (!gitHubRepoUrl.value) { return; }

   try {
      const encodedRepoUrl = encodeURIComponent(gitHubRepoUrl.value);
      await fetch(`http://localhost:8080/api/repo/add?repoUrl=${encodedRepoUrl}`);
      gitHubRepoUrl.value = "";
   } catch (error) {
      console.error('Error adding repo:', error);
   }
});

buttonUploadData.addEventListener("click", (e) => {
   e.preventDefault();
   uploadData();
   toggleConfigAndViewDataButton(false);
});

buttonAlertCloseUploadData.addEventListener("click", () => {
   alertSuccessUploadData.style.display = "none";
});

buttonAlertCloseClearData.addEventListener("click", () => {
   alertSuccessClearData.style.display = "none";
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
                          toggleConfigAndViewDataButton(false);
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

function jsonToCsv(jsonData) {
   const keys = Object.keys(jsonData[0]);
   const csvRows = [keys.join(',')];

   jsonData.forEach(row => {
      const values = keys.map(key => {
         let value = row[key];
         if (key === 'file' && typeof value === 'string') {
            value = value.replace(/\.java$/, '').replace(/"/g, '');
         } else if (typeof value === 'string') {
            value = value.replace(/"/g, '');
         }
         return value;
      });
      csvRows.push(values.join(','));
   });
   return csvRows.join('\n');
}

function createCsvFile(csvString, fileName = 'data.csv') {
   const blob = new Blob([csvString], { type: 'text/csv' });
   return new File([blob], fileName, { type: 'text/csv' });
}

export { startFetching, stopFetching };