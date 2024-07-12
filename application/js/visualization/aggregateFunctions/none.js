import { getListGuis, getNormalizer } from "../../data.js";

/**
 * 
 * This method is used for calculating the "none" aggregate function.
 * 
 * Here, I want to loop through all buildings and data points of that building
 * and calculate the maxMetaphorValue for all metaphor values that lie within the range of the slider.
 * 
 * By doing this I calculate the maxMetaphorValue per building
 * and the lastMetaphorValue per building.
 * 
 * Then I want to show the ratio between the maxMetaphorValue and the lastMetaphorValue
 * as the respective metaphor.
 * 
 */

const aggregateFunctionNone = (treeOfBuildings, lowerRangeBounds, upperRangeBounds) => {

   let heightMetaphor = treeOfBuildings.list[0].metaphorSelection.height;
   let hueMetaphor = treeOfBuildings.list[0].metaphorSelection.hue;
   let saturationMetaphor = getListGuis()[0].thresholdParams.dropdown;
   let saturationThreshold = getListGuis()[0].thresholdParams.threshold;
   let saturationValueForBuildingsBelowThreshold = getListGuis()[0].thresholdParams.saturation;
   let luminanceMetaphor = treeOfBuildings.list[0].metaphorSelection.luminance;
   //
   let maxHeightValue = 0;
   let maxHueValue = 0;
   let maxLuminanceValue = 0;
   //
   for (let building of treeOfBuildings.list) {
      let heightValue = 0;
      let hueValue = 0;
      let luminanceValue = 0;
      for (let entry of building.buildingData) {
         if (parseInt(entry.timestamp) >= lowerRangeBounds && parseInt(entry.timestamp) <= upperRangeBounds) {
            heightValue = parseInt(entry[heightMetaphor]);
            hueValue = parseInt(entry[hueMetaphor]);
            luminanceValue = parseInt(entry[luminanceMetaphor]);
         }
      }
      if (heightValue > maxHeightValue) {
         maxHeightValue = heightValue;
      }
      if (hueValue > maxHueValue) {
         maxHueValue = hueValue;
      }
      if (luminanceValue > maxLuminanceValue) {
         maxLuminanceValue = luminanceValue;
      }
   }

   for (let building of treeOfBuildings.list) {
      let lastHeightValue = 0;
      let lastHueValue = 0;
      let lastSaturationValue = 0;
      let lastLuminanceValue = 0;
      for (let entry of building.buildingData) {
         // here we collect the data for all entries that are within the range
         if (parseInt(entry.timestamp) >= lowerRangeBounds && parseInt(entry.timestamp) <= upperRangeBounds) {
            lastHeightValue = parseInt(entry[heightMetaphor]);
            lastHueValue = parseInt(entry[hueMetaphor]);
            lastSaturationValue = parseInt(entry[saturationMetaphor]);
            lastLuminanceValue = parseInt(entry[luminanceMetaphor]);
         }
      }

      // Visibility
      building.visible = lastHeightValue > 0;

      // Height
      building.scale.y = getNormalizer().normalizeHeight(lastHeightValue);
      building.position.y = building.scale.y / 2 + 0.1;
      building.currentHeightValue = lastHeightValue;

      // Color
      let hue = lastHueValue / maxHueValue;
      let saturation = 1;
      if (lastSaturationValue <= saturationThreshold) {
         saturation = saturationValueForBuildingsBelowThreshold;
      }
      let luminance = lastLuminanceValue / maxLuminanceValue;
      let ratio = 1;
      building.setColorHue(hue, ratio);
      building.setColorSaturation(saturation, ratio);
      building.setColorLuminance(luminance, ratio);
   }
}

export { aggregateFunctionNone };