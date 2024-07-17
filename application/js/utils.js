import {
   removeAllGuis, setListModelTrees, setMetaphorSelection,
   setVisualizationData, setListTreeOfBuildings, setNormalizer,
   removeAllRenderers
} from "./data";
import { removeArrow } from "./visualization/arrow";

/**
 * Method to return a date in the format "YYYY-MM-DD, HH:MM:SS:SSS"
 * 
 * @param {Date} date 
 * @returns {String} // Date in the format "YYYY-MM-DD, HH:MM:SS:SSS"
 */
const formatDate = date => {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");
   const hours = String(date.getHours()).padStart(2, "0");
   const minutes = String(date.getMinutes()).padStart(2, "0");
   const seconds = String(date.getSeconds()).padStart(2, "0");
   const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

   return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}:${milliseconds}`;
}

/**
 * Method to convert RGB to HSL
 * 
 * @param {number} r // between 0-255
 * @param {number} g // between 0-255 
 * @param {number} b // between 0-255 
 * @returns {array[float]} // array of floats [h, s, l] where h is between 0-360, s is between 0-100 and l is between 0-100
 */
const rgbToHsl = color => {
   let r = color.r;
   let g = color.g;
   let b = color.b;

   r /= 255, g /= 255, b /= 255;
   var max = Math.max(r, g, b), min = Math.min(r, g, b);
   var h, s, l = (max + min) / 2;

   if (max == min) {
      h = s = 0;
   } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
         case r: h = (g - b) / d + (g < b ? 6 : 0); break;
         case g: h = (b - r) / d + 2; break;
         case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
   }

   return { h, s, l };
}

/**
 * Method to convert a hex color to an RGB object
 * 
 * @param {String} hex 
 * @returns RGB object
 */
const hexToRgb = hex => {
   // Remove the hash at the start if it's there
   hex = hex.replace(/^#/, '');

   // Parse the hex string
   const r = parseInt(hex.substring(0, 2), 16);
   const g = parseInt(hex.substring(2, 4), 16);
   const b = parseInt(hex.substring(4, 6), 16);

   return { r, g, b };
}

/**
 * Method to convert a timestamp to a date in the format "YYYY-MM-DD, HH:MM:SS:SSS"
 * 
 * @param {string} timestamp // timestamp in the format "YYYYMMDDHHmmssSSS"
 * @returns {Date} // Date in the format "YYYY-MM-DD, HH:MM:SS:SSS"
 */
const timestampToDate = timestamp => {
   let year = parseInt(timestamp.substring(0, 4));
   // substraction of 1 because the month is zero-based
   let month = parseInt(timestamp.substring(4, 6)) - 1;
   let day = parseInt(timestamp.substring(6, 8));
   let hour = parseInt(timestamp.substring(8, 10));
   let minute = parseInt(timestamp.substring(10, 12));
   let second = parseInt(timestamp.substring(12, 14));
   let millisecond = parseInt(timestamp.substring(14));
   return new Date(year, month, day, hour, minute, second, millisecond);
}

/**
 * Method to get the minimum summed up value of an attribute based on all datapoints
 * of the buildings from a given listOfBuildings.
 * 
 * @param {String} attribute // the attribute name
 * @param {Array} listOfBuildings // the list of buildings
 * @returns {Number} // the minimum value of the attribute
 */
const getMinValueByAttributeAggregatedByBuildingSum = (attribute, listOfBuildings) => {
   let min = Infinity;
   for (let building of listOfBuildings) {
      let sum = building.buildingData.reduce((acc, row) => {
         return acc + parseFloat(row[attribute]);
      }, 0);
      if (sum < min) {
         min = sum;
      }
   }
   return min;
}

/**
 * Method to get the maximum summed up value of an attribute based on all datapoints
 * of the buildings from a given listOfBuildings.
 * 
 * @param {String} attribute // the attribute name
 * @param {Array} listOfBuildings // the list of buildings
 * @returns {Number} // the maximum value of the attribute
 */
const getMaxValueByAttributeAggregatedByBuildingSum = (attribute, listOfBuildings) => {
   let max = -Infinity;
   for (let building of listOfBuildings) {
      let sum = building.buildingData.reduce((acc, row) => {
         return acc + parseFloat(row[attribute]);
      }, 0);
      if (sum > max) {
         max = sum;
      }
   }
   return max;
}

/**
 * Method to get the minimum value of an attribute based on all datapoints
 * of the buildings from a given listOfBuildings.
 * 
 * @param {String} attribute // the attribute name
 * @param {Array} listOfBuildings // the list of buildings
 * @returns {Number} // the minimum value of the attribute
 */
const getMinValueByAttribute = (attribute, listOfBuildings) => {
   let min = Infinity;
   for (let building of listOfBuildings) {
      for (let row of building.buildingData) {
         let value = parseFloat(row[attribute]);
         if (value < min) {
            min = value;
         }
      }
   }
   return min;
}

/**
 * Method to get the maximum value of an attribute based on all datapoints
 * of the buildings from a given listOfBuildings.
 * 
 * @param {String} attribute // the attribute name
 * @param {Array} listOfBuildings // the list of buildings
 * @returns {Number} // the maximum value of the attribute
 */
const getMaxValueByAttribute = (attribute, listOfBuildings) => {
   let max = -Infinity;
   for (let building of listOfBuildings) {
      for (let row of building.buildingData) {
         let value = parseFloat(row[attribute]);
         if (value > max) {
            max = value;
         }
      }
   }
   return max;
}

const removeAllEventListeners = (element) => {
   const clone = element.cloneNode(true);
   element.parentNode.replaceChild(clone, element);
   return clone;
};

const removeElementAndChildrenWithListeners = (element) => {
   try {
      // Recursively remove all children
      while (element.firstChild) {
         removeElementAndChildrenWithListeners(element.firstChild);
      }

      // Remove the element itself
      element = removeAllEventListeners(element);
      if (element.parentNode) {
         element.parentNode.removeChild(element);
      }
   } catch (error) { }
};

/**
 * Method to destroy and remove the visualization, including the scene, camera, renderer and controls.
 * Also destroy and remove the dat.gui GUI.
 */
const destroyAndRemoveVisualization = () => {

   // Remove model trees from UI and data store
   document.getElementById("frame-model-tree").style.display = "none";
   let modelTreeContainer = document.getElementById("model-tree-container");
   removeElementAndChildrenWithListeners(modelTreeContainer);
   setListModelTrees([]);

   // Remove dat.gui GUI from UI and data store
   removeAllGuis();

   // Reset metaphor selection in data store
   setMetaphorSelection({});

   // Reset visualization data in data store
   setVisualizationData([]);

   // Reset list of tree of buildings in data store
   setListTreeOfBuildings([]);

   // Reset normalizer in data store
   setNormalizer(null);

   // Remove arrow from scene
   removeArrow();

   // Remove all renderers
   removeAllRenderers();

   // Reset and hide slider
   document.getElementById("slider-window-width").style.width = "0px";
   document.getElementById("slider-container").style.display = "none";

   // Reset and hide aggregate function element
   document.getElementById("aggregate-function").value = "none";
   document.getElementById("aggregate-function").style.display = "none";
}

/**
 * Remove an element and all its event listeners.
 * 
 * @param {HTMLElement} element - The element to be removed.
 */
const removeElementWithListeners = (element) => {
   const clone = element.cloneNode(false);

   // Replace the original element with the clone, removing all event listeners
   element.parentNode.replaceChild(clone, element);

   // Remove the cloned element from the DOM
   clone.remove();
};

export {
   formatDate, rgbToHsl, hexToRgb, timestampToDate,
   getMinValueByAttribute, getMaxValueByAttribute, destroyAndRemoveVisualization
}