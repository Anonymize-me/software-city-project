import { getParticipants, getTasks, getAttributeNames, setOriginalData, getDataType, getOriginalData } from "../data.js";
import { buildTable } from "./table.js";
import { getConfig, getMapping } from "./cookieManager.js";

const dimensionAttributeSelection = document.getElementById("dimension-attribute-selection");
const heightAttributeSelection = document.getElementById("height-attribute-selection");
const colorAttributeSelection = document.getElementById("color-attribute-selection");

const alertSuccessUploadData = document.getElementById("alert-success-upload-data");
const frameUpload = document.getElementById("frame-upload");

const groupingPathSelection = document.getElementById("groupingPath-selection");
const timestampSelection = document.getElementById("timestamp-selection");
const participantSelectionLabel = document.getElementById("participant-selection-label");
const participantSelection = document.getElementById("participant-selection");
const taskIdSelectionLabel = document.getElementById("taskId-selection-label");
const taskIdSelection = document.getElementById("taskId-selection");

const uploadData = () => {
   document.getElementById("instructions").style.display = "none";

   const file = document.getElementById("file").files[0];

   let reader = new FileReader();
   reader.readAsText(file);

   reader.onload = e => {
      setOriginalData(e.target.result, document.getElementById("file-format").value);

      // populate the config dropdowns with 1 empty option and the attribute names
      groupingPathSelection.replaceChildren();
      timestampSelection.replaceChildren();
      timestampSelection.appendChild(document.createElement("option"));
      participantSelection.replaceChildren();
      participantSelection.appendChild(document.createElement("option"));
      taskIdSelection.replaceChildren();
      taskIdSelection.appendChild(document.createElement("option"));

      getAttributeNames().forEach(attributeName => {
         const newElement = document.createElement("option");
         newElement.value = attributeName;
         newElement.innerText = attributeName;
         groupingPathSelection.appendChild(newElement.cloneNode(true));
         timestampSelection.appendChild(newElement.cloneNode(true));
         participantSelection.appendChild(newElement.cloneNode(true));
         taskIdSelection.appendChild(newElement.cloneNode(true));
      });

      // load a config (if present for the attributes)
      // set the config dropdowns to the values of the config
      let config = getConfig();
      if (config.length > 0) {
         config = JSON.parse(getConfig()[0].split('=')[1]).config;
         groupingPathSelection.value = config.groupingPath;
         timestampSelection.value = config.timestamp;
         participantSelection.value = config.participant;
         taskIdSelection.value = config.taskId;
      }


      if (getDataType() === "java-source-code") {
         participantSelection.style.display = "none";
         participantSelectionLabel.style.display = "none";
         taskIdSelection.style.display = "none";
         taskIdSelectionLabel.style.display = "none";
      } else {
         participantSelection.style.display = "block";
         participantSelectionLabel.style.display = "block";
         taskIdSelection.style.display = "block";
         taskIdSelectionLabel.style.display = "block";
      }

      // alert success and hide upload frame
      alertSuccessUploadData.style.display = "block";
      $("#alert-success-upload-data").delay(2000).fadeOut(800);
      frameUpload.style.display = "none";

      buildTable();
      document.getElementById("view-data").style.display = "block";
   }
}

export { uploadData };