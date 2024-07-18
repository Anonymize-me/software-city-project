import {
   getAttributeNames,
   getDataType,
   getOriginalData,
   getParticipants,
   getTasks,
   getVisualizationData,
   setListTreeOfBuildings,
   setMetaphorSelection,
   setVisualizationData,
} from '../data';
import { visualize } from '../visualization/visualize';
import { buildTreesOfBuildings } from '../visualization/TreeOfBuildings';
import { getConfig, getMapping, updateMapping } from './cookieManager';

const participant = document.getElementById('participant');
const participantLabel = document.getElementById('participant-label');
const taskId = document.getElementById('taskId');
const taskIdLabel = document.getElementById('taskId-label');

const buttonStartVisualize = document.getElementById('button-start-visualize');

const dimensionAttributeSelection = document.getElementById(
   'dimension-attribute-selection',
);
const heightAttributeSelection = document.getElementById(
   'height-attribute-selection',
);
const hueAttributeSelection = document.getElementById(
   'hue-attribute-selection',
);
const luminanceAttributeSelection = document.getElementById(
   'luminance-attribute-selection',
);

const frameModelTree = document.getElementById('frame-model-tree');
const frameInfo = document.getElementById('frame-info');

const prepareMetaphorsFrame = () => {
   dimensionAttributeSelection.replaceChildren();
   heightAttributeSelection.replaceChildren();
   // append 1 empty option and the rest of the attributes
   hueAttributeSelection.replaceChildren();
   hueAttributeSelection.appendChild(document.createElement('option'));
   luminanceAttributeSelection.replaceChildren();
   luminanceAttributeSelection.appendChild(document.createElement('option'));

   getAttributeNames().forEach((attributeName) => {
      const newElement = document.createElement('option');
      newElement.value = attributeName;
      newElement.innerText = attributeName;
      dimensionAttributeSelection.appendChild(newElement.cloneNode(true));
      heightAttributeSelection.appendChild(newElement.cloneNode(true));
      hueAttributeSelection.appendChild(newElement.cloneNode(true));
      luminanceAttributeSelection.appendChild(newElement.cloneNode(true));
   });

   participant.style.display = 'block';
   participantLabel.style.display = 'block';
   taskId.style.display = 'block';
   taskIdLabel.style.display = 'block';

   participant.replaceChildren();
   participant.appendChild(document.createElement('option'));
   getParticipants().forEach((entry) => {
      let newElement = document.createElement('option');
      newElement.value = entry;
      newElement.innerText = `participant - ${entry}`;
      participant.appendChild(newElement);
   });

   taskId.replaceChildren();
   taskId.appendChild(document.createElement('option'));
   getTasks().forEach((entry) => {
      let newElement = document.createElement('option');
      newElement.value = entry;
      newElement.innerText = `task - ${entry}`;
      taskId.appendChild(newElement);
   });

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
      participant.value = '';
      taskId.value = '';
      if (config.participant === '') {
         participant.disabled = true;
      } else {
         participant.disabled = false;
         participant.value = config.participant;
      }
      if (config.taskId === '') {
         taskId.disabled = true;
      } else {
         taskId.disabled = false;
         taskId.value = config.taskId;
      }
   }
};

buttonStartVisualize.addEventListener('click', (e) => {
   e.preventDefault();

   let metaphorSelection = {
      dimension: dimensionAttributeSelection.value,
      height: heightAttributeSelection.value,
      hue: hueAttributeSelection.value,
      luminance: luminanceAttributeSelection.value,
   };

   document.getElementById('frame-metaphors').style.display = 'none';
   document.getElementById('view-data').style.display = 'none';

   let data = getOriginalData();
   let participant = document.getElementById('participant').value;
   let taskId = document.getElementById('taskId').value;

   // update the mapping in the cookies_manager
   const mapping = {
      dimension: metaphorSelection.dimension,
      height: metaphorSelection.height,
      hue: metaphorSelection.hue,
      luminance: metaphorSelection.luminance,
      participant: participant,
      taskId: taskId,
   };
   updateMapping(mapping);
   setMetaphorSelection(mapping);

   data = data.filter((entry) => {
      return (
         entry.participant === participant.toString() &&
         entry.taskId === taskId.toString()
      );
   });

   setVisualizationData(data);

   if (getVisualizationData().length === 0) {
      alert('No data available for the selected participant and task.');
      return;
   }

   let treeOfBuildingsList = buildTreesOfBuildings();

   setListTreeOfBuildings(treeOfBuildingsList);

   visualize(treeOfBuildingsList);

   frameModelTree.style.display = 'block';
   frameInfo.style.display = 'block';
});

export { prepareMetaphorsFrame as prepareMetaphorsFrame };
