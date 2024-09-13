/**
 * Data store for the application where the original data is stored and processed.
 */

let dataStore = {
   originalData: [],
   attributeNames: [],
   dataType: '',
   visualizationData: [],
   metaphorSelection: {},
};

const processOriginalData = (config) => {
   let listDataObjects = [];
   dataStore.originalData.forEach((entry) => {
      let dataObject = {};
      for (let i = 0; i < dataStore.attributeNames.length; i++) {
         let attributeName = dataStore.attributeNames[i];

         if (attributeName === config.groupingPath) {
            dataObject['groupingPath'] = entry[attributeName];
         } else if (attributeName === config.timestamp) {
            dataObject['timestamp'] = entry[attributeName];
         } else if (
            attributeName === config.participant &&
            dataStore.dataType === 'generic'
         ) {
            dataObject['participant'] = entry[attributeName];
         } else if (
            attributeName === config.taskId &&
            dataStore.dataType === 'generic'
         ) {
            dataObject['taskId'] = entry[attributeName];
         } else {
            dataObject[attributeName] = entry[attributeName];
         }
      }
      listDataObjects.push(dataObject);
   });

   dataStore.originalData = listDataObjects;
   dataStore.visualizationData = [];
   dataStore.attributeNames = Object.keys(dataStore.originalData[0]);
};

const clearData = () => {
   dataStore.originalData = [];
   dataStore.attributeNames = [];
   dataStore.dataType = '';
   dataStore.visualizationData = [];
   dataStore.metaphorSelection = {};
};

const getEpoques = () => {
   const epoques = [];
   dataStore.visualizationData.forEach((entry) => {
      const parsedTimestamp = parseInt(entry.timestamp);
      if (!epoques.some(epoque => epoque.timestamp === parsedTimestamp)) {
         epoques.push({
            timestamp: parsedTimestamp,
            commitHash: entry.commitHash
         });
      }
   });

   return epoques;
};

const getParticipants = () => {
   let participants = [];
   dataStore.originalData.forEach((entry) => {
      if (!participants.includes(entry.participant)) {
         participants.push(entry.participant);
      }
   });
   return participants;
};

const getTasks = () => {
   let tasks = [];
   dataStore.originalData.forEach((entry) => {
      if (!tasks.includes(entry.taskId)) {
         tasks.push(entry.taskId);
      }
   });
   return tasks;
};

const getOriginalData = () => {
   return dataStore.originalData;
};

const getAttributeNames = () => {
   return dataStore.attributeNames;
};

const getDataType = () => {
   return dataStore.dataType;
};

const getVisualizationData = () => {
   return dataStore.visualizationData;
};

const getMetaphorSelection = () => {
   return dataStore.metaphorSelection;
};

const setOriginalData = (data, dataType) => {
   clearData();
   let lines = data.split('\n');
   let attributeNames = lines.shift().split(',');
   attributeNames = attributeNames.map((attributeName) => {
      return (
         attributeName.slice(0, 1).toLowerCase() +
         attributeName.replace(' ', '').slice(1)
      );
   });

   lines.forEach((line) => {
      if (line === '') {
         return;
      }
      let dataObject = {};
      let values = line.split(',');
      for (let i = 0; i < attributeNames.length; i++) {
         dataObject[attributeNames[i]] = values[i];
      }
      dataStore.originalData.push(dataObject);
   });

   dataStore.attributeNames = attributeNames;
   dataStore.dataType = dataType;
};

const setVisualizationData = (data) => {
   dataStore.visualizationData = data;
};

const setMetaphorSelection = (metaphorSelection) => {
   dataStore.metaphorSelection = metaphorSelection;
};

const setDirector = (director) => {
   dataStore.director = director;
};

const getDirector = () => {
   return dataStore.director;
};

export {
   processOriginalData,
   clearData,
   getEpoques,
   getParticipants,
   getTasks,
   getOriginalData,
   getAttributeNames,
   getDataType,
   getVisualizationData,
   getMetaphorSelection,
   setOriginalData,
   setVisualizationData,
   setMetaphorSelection,
   setDirector,
   getDirector,
};
