import { getAttributeNames, setOriginalData, getDataType } from "../data.js";
import { buildTable } from "./table.js";
import { getConfig } from "./cookie-manager.js";

const alertSuccessUploadData = document.getElementById(
   "alert-success-upload-data"
);
const frameUpload = document.getElementById("frame-upload");

const groupingPathSelection = document.getElementById("groupingPath-selection");
const timestampSelection = document.getElementById("timestamp-selection");
const participantSelectionLabel = document.getElementById(
   "participant-selection-label"
);
const participantSelection = document.getElementById("participant-selection");
const taskIdSelectionLabel = document.getElementById("taskId-selection-label");
const taskIdSelection = document.getElementById("taskId-selection");

const uploadData = (fileParam = null) => {
   document.getElementById("instructions").style.display = "none";

   let file = null;

   if (fileParam === null) {
      if (document.getElementById("file").files.length === 0) {
         alert("No file selected");
         return;
      } else {
         file = document.getElementById("file").files[0];
      }
   } else {
      file = fileParam;
      document.getElementById("file-format").value = "git-java";
   }

   let reader = new FileReader();
   reader.readAsText(file);

   reader.onload = (e) => {
      document.getElementById("button-view-data").click();
      setOriginalData(
         e.target.result,
         document.getElementById("file-format").value
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

      alertSuccessUploadData.style.display = "block";
      $("#alert-success-upload-data").delay(2000).fadeOut(800);
      frameUpload.style.display = "none";

      buildTable();
      document.getElementById("view-data").style.display = "block";
   };
};

export { uploadData };
