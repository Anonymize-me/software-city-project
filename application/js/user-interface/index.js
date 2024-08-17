import { getDataType, clearData, processOriginalData } from "../data";
import { updateConfig } from "./cookie-manager";
import { uploadData } from "./upload";
import { buildTable } from "./table";
import { prepareMetaphorsFrame } from "./visualize";
import {
   getBioMetricsFiles,
   getRepositoryData,
   getStaticMetricFiles,
   getFileContent,
   downloadRepo,
} from "./github-api-adapter";
import { destroyCity } from "../utils";
import { removeArrow } from "../visualization/info-panel-builder";

const buttonGitHubRepo = document.getElementById("button-github-repo");
const buttonUpload = document.getElementById("button-upload");
const buttonConfig = document.getElementById("button-config");
const buttonMetaphors = document.getElementById("button-metaphors");
const buttonViewData = document.getElementById("button-view-data");
const buttonClearData = document.getElementById("button-clear-data");
const buttonModelTree = document.getElementById("button-model-tree");

const viewData = document.getElementById("view-data");

const frameGitHubRepo = document.getElementById("frame-github-repo");
const frameUpload = document.getElementById("frame-upload");
const frameConfig = document.getElementById("frame-config");
const frameMetaphors = document.getElementById("frame-metaphors");
const frameModelTree = document.getElementById("frame-model-tree");
const frameInfo = document.getElementById("frame-info");

const buttonsClose = document.getElementsByClassName("button-close");

const gitHubRepo = document.getElementById("github-repo");
const gitHubRepoUrl = document.getElementById("github-repo-url");

const buttonFetch = document.getElementById("button-fetch");
const buttonUploadData = document.getElementById("button-upload-data");
const buttonSaveConfig = document.getElementById("button-save-config");

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
   buttonFetch.disabled = !(gitHubRepoUrl.value || gitHubRepo.value);
}

gitHubRepoUrl.addEventListener("input", () => {
   if (gitHubRepoUrl.value) {
      gitHubRepo.value = "";
   }
   toggleFetchButton();
});

gitHubRepo.addEventListener("change", () => {
   if (gitHubRepo.value) {
      gitHubRepoUrl.value = "";
   }
   toggleFetchButton();
});

buttonGitHubRepo.addEventListener("click", () => {
   frameUpload.style.display = "none";
   frameConfig.style.display = "none";
   frameMetaphors.style.display = "none";
   frameInfo.style.display = "none";
   removeArrow();
   frameModelTree.style.display = "none";
   if (
      frameGitHubRepo.style.display === "none" ||
      frameGitHubRepo.style.display === ""
   ) {
      frameGitHubRepo.style.display = "block";
   } else {
      frameGitHubRepo.style.display = "none";
   }
});

buttonUpload.addEventListener("click", () => {
   frameGitHubRepo.style.display = "none";
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
   frameGitHubRepo.style.display = "none";
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
   frameGitHubRepo.style.display = "none";
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
   frameGitHubRepo.style.display = "none";
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

for (let i = 0; i < buttonsClose.length; i++) {
   buttonsClose[i].addEventListener("click", () => {
      switch (buttonsClose[i].parentElement.id) {
         case "frame-github-repo":
            frameGitHubRepo.style.display = "none";
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
            removeArrow();
            break;
         case "frame-model-tree":
            frameModelTree.style.display = "none";
            break;
      }
   });
}

document.addEventListener("keydown", (e) => {
   if (e.key === "Escape") {
      frameGitHubRepo.style.display = "none";
      frameUpload.style.display = "none";
      frameConfig.style.display = "none";
      frameMetaphors.style.display = "none";
      frameInfo.style.display = "none";
      removeArrow();
      frameModelTree.style.display = "none";
   }
});

buttonFetch.addEventListener("click", async (e) => {
   e.preventDefault();
   if (gitHubRepoUrl.value) {
      const repoName = gitHubRepoUrl.value.split("/").slice(-2).join("/");
      const metrics = await downloadRepo(repoName);
      const csvBlob = new Blob([metrics], { type: "text/csv" });
      const csvFile = new File([csvBlob], "metrics.csv", { type: "text/csv" });
      uploadData(csvFile);
      toggleConfigAndViewDataButton(false);
      console.log("Metrics successfully calculated and uploaded.");
   } else if (gitHubRepo.value) {
      const repoName = gitHubRepo.value;
      getRepositoryData(repoName);
      let allMetricsFileNames = [];
      allMetricsFileNames.push(await getStaticMetricFiles(repoName));
      allMetricsFileNames.push(await getBioMetricsFiles(repoName));
      console.log("All Metrics File Names:", allMetricsFileNames);

      allMetricsFileNames.forEach(async (fileNames) => {
         fileNames.forEach(async (fileName) => {
            await getFileContent(repoName, fileName);
         });
      });
   }
   frameGitHubRepo.style.display = "none";
   toggleConfigAndViewDataButton(false);
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

async function fetchRepositories() {
   try {
      const response = await fetch("/api/getRepositories");
      if (!response.ok) {
         throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const selectElement = document.getElementById("github-repo");
      selectElement.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "";
      selectElement.appendChild(defaultOption);
      data.forEach((repo) => {
         const option = document.createElement("option");
         option.value = repo;
         option.text = repo;
         selectElement.appendChild(option);
      });
   } catch (error) {
      console.error("Error fetching repositories:", error);
   }
}

// fetchRepositories();
