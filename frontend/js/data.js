let dataStore = {
   originalData: [],
   attributeNames: [],
   dataType: '',
   visualizationData: [],
   metaphorSelection: {},
};

/**
 * Method to process the originalData according to the config
 *
 * @param {Object} config // the configuration of attributesNames to [groupingPath, timestamp, participant, taskId]
 */
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
   // now, save in the dataStore.attributeNames the new attribute names
   dataStore.attributeNames = Object.keys(dataStore.originalData[0]);
};

/**
 * Method to clear the dataStore
 */
const clearData = () => {
   dataStore.originalData = [];
   dataStore.attributeNames = [];
   dataStore.dataType = '';
   dataStore.visualizationData = [];
   dataStore.metaphorSelection = {};
};

/**
 * Method to retrieve the epoques (only used for the java-source-code data type)
 *
 * @returns {Object} // the epoques
 */
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

/**
 * Method to retrieve the participants
 *
 * @returns {Array} // the participants
 */
const getParticipants = () => {
   let participants = [];
   dataStore.originalData.forEach((entry) => {
      if (!participants.includes(entry.participant)) {
         participants.push(entry.participant);
      }
   });
   return participants;
};

/**
 * Method to retrieve the tasks
 *
 * @returns {Array} // the tasks
 */
const getTasks = () => {
   let tasks = [];
   dataStore.originalData.forEach((entry) => {
      if (!tasks.includes(entry.taskId)) {
         tasks.push(entry.taskId);
      }
   });
   return tasks;
};

// ///////////////////
// GETTERS
// ///////////////////
const getDataStore = () => {
   return dataStore;
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

// ///////////////////
// SETTERS
// ///////////////////

/**
 * Method to set ...
 * - the original data
 * - the attribute names
 * - the data type
 *
 * @param {String} data // the data in csv format separated by commas and new lines for each new record
 * @param {String} dataType // the type of the data (e.g. "eye-tracking-java-source-code")
 */
const setOriginalData = (data, dataType) => {
   // clear the dataStore
   clearData();

   let lines = data.split('\n');

   // get the attribute names (first line of the csv file, and remove it from "lines")
   let attributeNames = lines.shift().split(',');
   attributeNames = attributeNames.map((attributeName) => {
      // remove the spaces and make the first letter lowercase
      return (
         attributeName.slice(0, 1).toLowerCase() +
         attributeName.replace(' ', '').slice(1)
      );
   });

   // iterate over all lines and add them to the dataStore
   lines.forEach((line) => {
      if (line === '') {
         return;
      }
      // create a new object for each line
      let dataObject = {};
      let values = line.split(',');
      for (let i = 0; i < attributeNames.length; i++) {
         dataObject[attributeNames[i]] = values[i];
      }
      dataStore.originalData.push(dataObject);
   });

   // set the attribute names and the data type
   dataStore.attributeNames = attributeNames;
   dataStore.dataType = dataType;
};

/**
 * Method to set the visualization data
 *
 * @param {Array} data
 */
const setVisualizationData = (data) => {
   dataStore.visualizationData = data;
};

/**
 * Method to set the metaphor selection
 *
 * @param {Object} metaphorSelection // mapping of metaphor selection
 */
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
   getDataStore,
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
