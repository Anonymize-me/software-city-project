import { getAttributeNames, setOriginalData, getDataType } from "../data.js";
import { buildTable } from "./table.js";
import { getConfig } from "./cookie-manager.js";
import {enableButtonConfig, enableButtonViewData} from "./navbar.js";
import {showSuccessUploadDataAlert} from "./alerts.js";
import {showViewData} from "./view-data.js";
import {showFrameGitHubRepo} from "./github-repo.js";
import {showInstructions} from "./instructions.js";

const frameUpload = document.getElementById("frame-upload");
const buttonCloseFrameUpload = document.getElementById("frame-upload-button-close");

const file = document.getElementById("file");
const fileFormat = document.getElementById("file-format");

const buttonUploadData = document.getElementById("button-upload-data");
const buttonViewData = document.getElementById("button-view-data");

const groupingPathSelection = document.getElementById("groupingPath-selection");
const timestampSelection = document.getElementById("timestamp-selection");
const participantSelectionLabel = document.getElementById(
   "participant-selection-label"
);
const participantSelection = document.getElementById("participant-selection");
const taskIdSelectionLabel = document.getElementById("taskId-selection-label");
const taskIdSelection = document.getElementById("taskId-selection");

const showFrameUpload = (show) => {
    if (show) {
        frameUpload.style.display = "block";
    } else {
        frameUpload.style.display = "none";
    }
}

const toggleFrameUpload = () => {
   showFrameUpload(frameUpload.style.display === "none" || frameUpload.style.display === "");
}

buttonCloseFrameUpload.addEventListener("click", () => {
    showFrameUpload(false);
});

buttonUploadData.addEventListener("click", (e) => {
   e.preventDefault();
   uploadData();
   enableButtonConfig(true);
   enableButtonViewData(true);
});

const uploadData = (fileParam = null) => {

   showInstructions(false);

   let f = null;

   if (fileParam === null) {
      if (file.files.length === 0) {
         alert("No file selected");
         return;
      } else {
         f = file.files[0];
      }
   } else {
      f = fileParam;
      fileFormat.value = "git-java";
   }

   let reader = new FileReader();
   reader.readAsText(f);

   reader.onload = (e) => {
      buttonViewData.click();
      setOriginalData(
         e.target.result,
         fileFormat.value
      );

      groupingPathSelection.replaceChildren();
      timestampSelection.replaceChildren();
      timestampSelection.appendChild(document.createElement("option"));

      if (getDataType() === "generic") {
         participantSelection.replaceChildren();
         participantSelection.appendChild(document.createElement("option"));
         taskIdSelection.replaceChildren();
         taskIdSelection.appendChild(document.createElement("option"));

         participantSelection.style.display = "block";
         participantSelectionLabel.style.display = "block";
         taskIdSelection.style.display = "block";
         taskIdSelectionLabel.style.display = "block";
      } else if (getDataType() === "git-java") {
         participantSelection.style.display = "none";
         participantSelectionLabel.style.display = "none";
         taskIdSelection.style.display = "none";
         taskIdSelectionLabel.style.display = "none";
      }

      getAttributeNames().forEach((attributeName) => {
         const newElement = document.createElement("option");
         newElement.value = attributeName;
         newElement.innerText = attributeName;
         groupingPathSelection.appendChild(newElement.cloneNode(true));
         timestampSelection.appendChild(newElement.cloneNode(true));
         participantSelection.appendChild(newElement.cloneNode(true));
         taskIdSelection.appendChild(newElement.cloneNode(true));
      });

      let config = getConfig();
      if (config.length > 0) {
         config = JSON.parse(getConfig()[0].split("=")[1]).config;
         groupingPathSelection.value = config.groupingPath;
         timestampSelection.value = config.timestamp;
         participantSelection.value = config.participant;
         taskIdSelection.value = config.taskId;
      }

      showSuccessUploadDataAlert();

      buildTable();

      showFrameUpload(false);
      showViewData(true);

      enableButtonConfig(true);
   };
};

export { showFrameUpload, toggleFrameUpload, uploadData };
