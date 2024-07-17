import { getAttributeNames, getDataType, getOriginalData, getParticipants, getTasks, setListTreeOfBuildings, setMetaphorSelection, setVisualizationData } from "../data";
import { visualize } from "../visualization/visualize";
import { buildTreesOfBuildings } from "../visualization/TreeOfBuildings";
import { getConfig, getMapping, updateMapping } from "./cookieManager";

const buttonStartVisualize = document.getElementById("button-start-visualize");

const dimensionAttributeSelection = document.getElementById("dimension-attribute-selection");
const heightAttributeSelection = document.getElementById("height-attribute-selection");
const hueAttributeSelection = document.getElementById("hue-attribute-selection");
const luminanceAttributeSelection = document.getElementById("luminance-attribute-selection");

const frameModelTree = document.getElementById("frame-model-tree");
const frameInfo = document.getElementById("frame-info");

const prepareMetaphorsFrame = () => {

   dimensionAttributeSelection.replaceChildren();
   heightAttributeSelection.replaceChildren();
   // append 1 empty option and the rest of the attributes
   hueAttributeSelection.replaceChildren();
   hueAttributeSelection.appendChild(document.createElement("option"));
   luminanceAttributeSelection.replaceChildren();
   luminanceAttributeSelection.appendChild(document.createElement("option"));

   getAttributeNames().forEach(attributeName => {
      const newElement = document.createElement("option");
      newElement.value = attributeName;
      newElement.innerText = attributeName;
      dimensionAttributeSelection.appendChild(newElement.cloneNode(true));
      heightAttributeSelection.appendChild(newElement.cloneNode(true));
      hueAttributeSelection.appendChild(newElement.cloneNode(true));
      luminanceAttributeSelection.appendChild(newElement.cloneNode(true));
   })

   if (getDataType() !== "java-source-code") {
      document.getElementById("participant").style.display = "block";
      document.getElementById("taskId").style.display = "block";
      document.getElementById("participant-label").style.display = "block";
      document.getElementById("taskId-label").style.display = "block";

      document.getElementById("participant").replaceChildren();
      document.getElementById("participant").appendChild(document.createElement("option"));
      getParticipants().forEach(participant => {
         let newElement = document.createElement("option");
         newElement.value = participant;
         newElement.innerText = `participant - ${participant}`;
         document.getElementById("participant").appendChild(newElement);
      });

      document.getElementById("taskId").replaceChildren();
      document.getElementById("taskId").appendChild(document.createElement("option"));
      getTasks().forEach(task => {
         let newElement = document.createElement("option");
         newElement.value = task;
         newElement.innerText = `task - ${task}`;
         document.getElementById("taskId").appendChild(newElement);
      });

   } else {
      let participant = document.getElementById("participant");
      let taskId = document.getElementById("taskId");

      participant.style.display = "none";
      taskId.style.display = "none";
      document.getElementById("participant-label").style.display = "none";
      document.getElementById("taskId-label").style.display = "none";

      while (participant.firstChild) {
         participant.removeChild(participant.firstChild);
      }

      while (taskId.firstChild) {
         taskId.removeChild(taskId.firstChild);
      }
   }

   // get a mapping from the cookies_manager
   let mapping = getMapping();
   if (mapping.length > 0) {
      mapping = JSON.parse(mapping[0].split('=')[1]).mapping;
      dimensionAttributeSelection.value = mapping.dimension;
      heightAttributeSelection.value = mapping.height;
      hueAttributeSelection.value = mapping.hue;
      luminanceAttributeSelection.value = mapping.luminance;
      participant.value = mapping.participant;
      taskId.value = mapping.taskId;
   }

   // if no participant and task mapping in the config is set,
   // disable the participant and task selection fields, and set the empty option by default.
   let config = getConfig();
   if (config.length > 0) {
      config = JSON.parse(getConfig()[0].split('=')[1]).config;
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
}

buttonStartVisualize.addEventListener("click", e => {
   e.preventDefault();

   let metaphorSelection = {
      dimension: dimensionAttributeSelection.value,
      height: heightAttributeSelection.value,
      hue: hueAttributeSelection.value,
      luminance: luminanceAttributeSelection.value
   }

   document.getElementById("frame-metaphors").style.display = "none";
   document.getElementById("view-data").style.display = "none";

   let data = getOriginalData();
   let participant = document.getElementById("participant").value;
   let taskId = document.getElementById("taskId").value;

   // update the mapping in the cookies_manager
   const mapping = {
      dimension: metaphorSelection.dimension,
      height: metaphorSelection.height,
      hue: metaphorSelection.hue,
      luminance: metaphorSelection.luminance,
      participant: participant,
      taskId: taskId
   }
   updateMapping(mapping);
   setMetaphorSelection(mapping);

   // filter data depending on participant and task selection
   if (getDataType() !== "java-source-code") {
      data = data.filter(entry => {
         return entry.participant === participant.toString() && entry.taskId === taskId.toString();
      });

   }

   setVisualizationData(data);

   let treeOfBuildingsList = buildTreesOfBuildings();

   setListTreeOfBuildings(treeOfBuildingsList);

   visualize(treeOfBuildingsList);

   frameModelTree.style.display = "block";
   frameInfo.style.display = "block";

});

export { prepareMetaphorsFrame as prepareMetaphorsFrame };