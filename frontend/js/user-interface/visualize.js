import {
   getAttributeNames,
   getMetaphorSelection,
   getDataType,
   getOriginalData,
   getParticipants,
   getTasks,
   getVisualizationData,
   setMetaphorSelection,
   setVisualizationData,
} from "../data";
import { getConfig, getMapping, updateMapping } from "./cookie-manager";
import BasicCityMetaphor from "../metaphor-models/basic-city-metaphor";
import Director from "../visualization/director";

const participant = document.getElementById("participant");
const participantLabel = document.getElementById("participant-label");
const taskId = document.getElementById("taskId");
const taskIdLabel = document.getElementById("taskId-label");

const buttonStartVisualize = document.getElementById("button-start-visualize");

const dimensionAttributeSelection = document.getElementById(
   "dimension-attribute-selection"
);
const heightAttributeSelection = document.getElementById(
   "height-attribute-selection"
);
const hueAttributeSelection = document.getElementById(
   "hue-attribute-selection"
);
const lightnessAttributeSelection = document.getElementById(
   "lightness-attribute-selection"
);

const frameModelTree = document.getElementById("frame-model-tree");
const frameInfo = document.getElementById("frame-info");

const prepareMetaphorsFrame = () => {
   dimensionAttributeSelection.replaceChildren();
   heightAttributeSelection.replaceChildren();
   // append 1 empty option and the rest of the attributes
   hueAttributeSelection.replaceChildren();
   hueAttributeSelection.appendChild(document.createElement("option"));
   lightnessAttributeSelection.replaceChildren();
   lightnessAttributeSelection.appendChild(document.createElement("option"));

   getAttributeNames().forEach((attributeName) => {
      const newElement = document.createElement("option");
      newElement.value = attributeName;
      newElement.innerText = attributeName;
      dimensionAttributeSelection.appendChild(newElement.cloneNode(true));
      heightAttributeSelection.appendChild(newElement.cloneNode(true));
      hueAttributeSelection.appendChild(newElement.cloneNode(true));
      lightnessAttributeSelection.appendChild(newElement.cloneNode(true));
   });

   if (getDataType() === "eye-tracking-java-source-code") {
      participant.style.display = "block";
      participantLabel.style.display = "block";
      taskId.style.display = "block";
      taskIdLabel.style.display = "block";

      participant.replaceChildren();
      participant.appendChild(document.createElement("option"));
      getParticipants().forEach((entry) => {
         let newElement = document.createElement("option");
         newElement.value = entry;
         newElement.innerText = `participant - ${entry}`;
         participant.appendChild(newElement);
      });

      taskId.replaceChildren();
      taskId.appendChild(document.createElement("option"));
      getTasks().forEach((entry) => {
         let newElement = document.createElement("option");
         newElement.value = entry;
         newElement.innerText = `task - ${entry}`;
         taskId.appendChild(newElement);
      });
   } else if (getDataType() === "java-source-code") {
      participant.style.display = "none";
      participantLabel.style.display = "none";
      taskId.style.display = "none";
      taskIdLabel.style.display = "none";
   }

   // get a mapping from the cookies_manager
   let mapping = getMapping();
   if (mapping.length > 0) {
      mapping = JSON.parse(mapping[0].split("=")[1]).mapping;
      dimensionAttributeSelection.value = mapping.dimension;
      heightAttributeSelection.value = mapping.height;
      hueAttributeSelection.value = mapping.hue;
      lightnessAttributeSelection.value = mapping.lightness;
      if (getDataType() === "eye-tracking-java-source-code") {
         participant.value = mapping.participant;
         taskId.value = mapping.taskId;
      }
   }

   // if no participant and task mapping in the config is set,
   // disable the participant and task selection fields, and set the empty option by default.
   let config = getConfig();
   if (config.length > 0) {
      config = JSON.parse(getConfig()[0].split("=")[1]).config;
      participant.value = "";
      taskId.value = "";
      if (config.participant === "") {
         participant.disabled = true;
      } else {
         participant.disabled = false;
         participant.value = config.participant;
      }
      if (config.taskId === "") {
         taskId.disabled = true;
      } else {
         taskId.disabled = false;
         taskId.value = config.taskId;
      }
   }
};

buttonStartVisualize.addEventListener("click", (e) => {
   e.preventDefault();

   const buttonViewData = document.getElementById("button-view-data");
   buttonViewData.click();

   const groupingPathSelection = document.getElementById(
      "groupingPath-selection"
   );
   const timestampSelection = document.getElementById("timestamp-selection");
   let config = getConfig();
   if (config.length > 0) {
      config = JSON.parse(getConfig()[0].split("=")[1]).config;
      groupingPathSelection.value = config.groupingPath;
      timestampSelection.value = config.timestamp;
   }

   const metaphorSelection = {
      groupingPath: groupingPathSelection.value,
      timestamp: timestampSelection.value,
      dimension: dimensionAttributeSelection.value,
      height: heightAttributeSelection.value,
      hue: hueAttributeSelection.value,
      lightness: lightnessAttributeSelection.value,
   };

   document.getElementById("frame-metaphors").style.display = "none";
   document.getElementById("view-data").style.display = "none";

   let data = getOriginalData();
   let participant = document.getElementById("participant").value;
   let taskId = document.getElementById("taskId").value;

   // update the mapping in the cookies_manager
   const mapping = {
      groupingPath: metaphorSelection.groupingPath,
      timestamp: metaphorSelection.timestamp,
      dimension: metaphorSelection.dimension,
      height: metaphorSelection.height,
      hue: metaphorSelection.hue,
      lightness: metaphorSelection.lightness,
   };
   if (getDataType() === "eye-tracking-java-source-code") {
      mapping.participant = participant;
      mapping.taskId = taskId;
   }

   updateMapping(mapping);
   setMetaphorSelection(mapping);

   if (getDataType() === "eye-tracking-java-source-code") {
      data = data.filter((entry) => {
         return (
            entry.participant === participant.toString() &&
            entry.taskId === taskId.toString()
         );
      });
   }

   setVisualizationData(data);

   if (getVisualizationData().length === 0) {
      alert("No data available for the selected participant and task.");
      return;
   }

   const basicCityMetaphor = new BasicCityMetaphor(getMetaphorSelection());

   const director = new Director(basicCityMetaphor, data);

   director.constructCity();

   frameModelTree.style.display = "block";
   frameInfo.style.display = "block";
});

export { prepareMetaphorsFrame as prepareMetaphorsFrame };
