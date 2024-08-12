import {
   getAttributeNames,
   getOriginalData,
   getParticipants,
   getTasks,
   getVisualizationData,
   setDirector,
   setMetaphorSelection,
   setVisualizationData,
} from '../data';
import { getConfig, getMapping, updateMapping } from './cookie-manager';
import CityMetaphor from '../metaphor-models/city-metaphor';
import MetaphorFactory from '../metaphor-models/metaphor-factory';
import Director from '../visualization/director';
import EnvironmentBuilder from '../visualization/environment-builder';
import CityElementBuilder from '../visualization/city-element-builder';
import SliderBuilder from '../visualization/slider-builder';
import ModelTreeBuilder from '../visualization/model-tree-builder';
import InfoPanelBuilder from '../visualization/info-panel-builder';
import GuiBuilder from '../visualization/gui-builder';

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
const lightnessAttributeSelection = document.getElementById(
   'lightness-attribute-selection',
);

const frameModelTree = document.getElementById('frame-model-tree');
const frameInfo = document.getElementById('frame-info');

const prepareMetaphorsFrame = () => {
   dimensionAttributeSelection.replaceChildren();
   heightAttributeSelection.replaceChildren();
   // append 1 empty option and the rest of the attributes
   hueAttributeSelection.replaceChildren();
   hueAttributeSelection.appendChild(document.createElement('option'));
   lightnessAttributeSelection.replaceChildren();
   lightnessAttributeSelection.appendChild(document.createElement('option'));

   getAttributeNames().forEach((attributeName) => {
      const newElement = document.createElement('option');
      newElement.value = attributeName;
      newElement.innerText = attributeName;
      dimensionAttributeSelection.appendChild(newElement.cloneNode(true));
      heightAttributeSelection.appendChild(newElement.cloneNode(true));
      hueAttributeSelection.appendChild(newElement.cloneNode(true));
      lightnessAttributeSelection.appendChild(newElement.cloneNode(true));
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
      lightnessAttributeSelection.value = mapping.lightness;
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
      lightness: lightnessAttributeSelection.value,
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
      lightness: metaphorSelection.lightness,
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

   // add groupingpath and timestamp to the metaphor selection
   metaphorSelection.groupingPath = 'className';
   metaphorSelection.timestamp = 'timestamp';

   const cityMetaphor = new CityMetaphor(data);

   const metaphorFactory = new MetaphorFactory();

   for (const metaphorName in metaphorSelection) {
      if (metaphorName === 'participant' || metaphorName === 'taskId') {
         continue;
      }

      const metaphor = metaphorFactory.createMetaphor(
         metaphorName,
         metaphorSelection[metaphorName],
      );

      if (metaphor) {
         cityMetaphor.registerMetaphor(metaphor);
      }
   }

   cityMetaphor.createCityElementDescriptors();

   const director = new Director(cityMetaphor);

   const environmentBuilder = new EnvironmentBuilder();
   const cityElementBuilder = new CityElementBuilder();
   const sliderBuilder = new SliderBuilder();
   const modelTreeBuildinger = new ModelTreeBuilder();
   const infoPanelBuilder = new InfoPanelBuilder();
   const guiBuilder = new GuiBuilder();
   director.registerBuilder(environmentBuilder);
   director.registerBuilder(cityElementBuilder);
   director.registerBuilder(sliderBuilder);
   director.registerBuilder(modelTreeBuildinger);
   director.registerBuilder(infoPanelBuilder);
   director.registerBuilder(guiBuilder);

   director.constructCity();

   frameModelTree.style.display = 'block';
   frameInfo.style.display = 'block';
});

export { prepareMetaphorsFrame as prepareMetaphorsFrame };
