import {
   minDimension,
   maxDimension,
   minHeight,
   maxHeight,
   minHue,
   maxHue,
   minLightness,
   maxLightness,
} from "../config.js";
import * as THREE from "three";
import { getDataType } from "../../data.js";

/**
 * This implementation of the recalculate function, is defined as:
 * - minimum and maximum values are taken from the whole dataset
 * - in the selected window, the last value of the selected metaphor is taken
 * - the value is scaled accordingly to the minimum and maximum values
 */

const recalculateGlobalNone = (
   cityMetaphor,
   cityElements,
   modelTreeBuilder,
   sliderBuilder,
   guiBuilder,
   infoPanelBuilder
) => {
   const dimensionMetaphor = cityMetaphor.metaphorSelection.dimension;

   const heightMetaphor = cityMetaphor.metaphorSelection.height;

   const hueMetaphor = cityMetaphor.metaphorSelection.hue;

   const saturationMetaphor = guiBuilder.gui.thresholdParams.dropdown;
   const saturationThreshold = guiBuilder.gui.thresholdParams.threshold;
   const saturationValueForBuildingsBelowThreshold =
      guiBuilder.gui.thresholdParams.saturation;

   const lightnessMetaphor = cityMetaphor.metaphorSelection.lightness;

   let minDimensionValue = Infinity;
   let maxDimensionValue = -Infinity;
   let maxHeightValue = -Infinity;
   let minHeightValue = Infinity;
   let maxHueValue = -Infinity;
   let minHueValue = Infinity;
   let maxLightnessValue = -Infinity;
   let minLightnessValue = Infinity;

   const buildings = cityElements.filter(
      (cityElement) => cityElement.elementType === "building"
   );

   for (const building of buildings) {
      let dimensionValue = 0;
      let heightValue = 0;
      let hueValue = 0;
      let lightnessValue = 0;
      for (const entry of building.buildingData) {
         dimensionValue = parseInt(entry[dimensionMetaphor]);
         heightValue = parseInt(entry[heightMetaphor]);
         hueValue = parseFloat(entry[hueMetaphor]);
         lightnessValue = parseFloat(entry[lightnessMetaphor]);

         if (dimensionValue > maxDimensionValue) {
            maxDimensionValue = dimensionValue;
         }
         if (dimensionValue < minDimensionValue) {
            minDimensionValue = dimensionValue;
         }
         if (heightValue > maxHeightValue) {
            maxHeightValue = heightValue;
         }
         if (heightValue < minHeightValue) {
            minHeightValue = heightValue;
         }
         if (hueValue > maxHueValue) {
            maxHueValue = hueValue;
         }
         if (hueValue < minHueValue) {
            minHueValue = hueValue;
         }
         if (lightnessValue > maxLightnessValue) {
            maxLightnessValue = lightnessValue;
         }
         if (lightnessValue < minLightnessValue) {
            minLightnessValue = lightnessValue;
         }
      }
   }

   for (const building of buildings) {
      let lastSeenDimensionValue = 0;
      let lastSeenHeightValue = 0;
      let lastSeenHueValue = 0;
      let lastSeenSaturationValue = 0;
      let lastSeenLightnessValue = 0;
      for (const entry of building.buildingData) {
         if (
             getDataType() === "generic" &&
             parseInt(entry.timestamp) >= sliderBuilder.lowerRangeBounds &&
            parseInt(entry.timestamp) <= sliderBuilder.upperRangeBounds
         ) {
            lastSeenDimensionValue = parseInt(entry[dimensionMetaphor]);
            lastSeenHeightValue = parseInt(entry[heightMetaphor]);
            lastSeenHueValue = parseFloat(entry[hueMetaphor]);
            lastSeenSaturationValue = parseFloat(entry[saturationMetaphor]);
            lastSeenLightnessValue = parseFloat(entry[lightnessMetaphor]);
         }
      }

      const buildingElement = cityElements.find(
         (cityElement) => cityElement.groupingPath === building.groupingPath
      );

      buildingElement.visible = lastSeenHeightValue > 0;

      if (maxHeightValue === minHeightValue) {
         buildingElement.scale.y = (maxHeight - minHeight) / 2 + minHeight;
      } else {
         buildingElement.scale.y =
             ((lastSeenHeightValue - minHeight) /
                 (maxHeightValue - minHeightValue)) *
             (maxHeight - minHeight) +
             minHeight;
      }

      const scaleValue = guiBuilder.optionsHeightMetaphor.scale;

      buildingElement.scale.y *= scaleValue;

      buildingElement.position.y = buildingElement.scale.y / 2 + 0.2;


      let c = {h:0, s:1, l:1};
      if(!!buildingElement.baseColor){
         // Use baseColor
         c = buildingElement.baseColor.getHSL({});
      }
      else{
        // No baseColor: create a color.
         if (maxHueValue === minHueValue)
            c.h = maxHue - ((maxHue - minHue) / 2 + minHue);
         else {
            c.h =
             maxHue - (((lastSeenHueValue - minHue) / (maxHueValue - minHueValue)) *
             (maxHue - minHue) +
             minHue);
         }
      }

      if (saturationMetaphor !== "") {
         c.s =
               lastSeenSaturationValue <= saturationThreshold
                  ? saturationValueForBuildingsBelowThreshold
                  : 1;
      }

      if (maxLightnessValue === minLightnessValue) 
         c.l = (maxLightness - minLightness) / 2 + minLightness;
      else {
         c.l =
               ((lastSeenLightnessValue - minLightness) /
                  (maxLightnessValue - minLightnessValue)) *
               (maxLightness - minLightness) +
               minLightness;
      }

      c = (new THREE.Color()).setHSL(c.h, c.s, c.l);

      // let hue = null;
      // if (buildingElement.baseColor === undefined) {
      //    if (maxHueValue === minHueValue) {
      //       hue = maxHue - ((maxHue - minHue) / 2 + minHue);
      //    } else {
      //       hue =
      //        maxHue - (((lastSeenHueValue - minHue) / (maxHueValue - minHueValue)) *
      //        (maxHue - minHue) +
      //        minHue);
      //    }
      // } else {
      //    hue = buildingElement.baseColor.h;
      // }

      // let saturation = null;
      // if (saturationMetaphor !== "") {
      //    saturation =
      //        lastSeenSaturationValue <= saturationThreshold
      //            ? saturationValueForBuildingsBelowThreshold
      //            : 1;
      // } else {
      //       saturation = 1;
      // }

      // let lightness = null;
      // if (maxLightnessValue === minLightnessValue) {
      //    lightness = (maxLightness - minLightness) / 2 + minLightness;
      // } else {
      //    lightness =
      //        ((lastSeenLightnessValue - minLightness) /
      //            (maxLightnessValue - minLightnessValue)) *
      //        (maxLightness - minLightness) +
      //        minLightness;
      // }

      // if (buildingElement.visible) {
      //    buildingElement.material.color = new THREE.Color().setHSL(
      //       hue,
      //       saturation,
      //       lightness
      //    );
      

      if (buildingElement.visible) {
         buildingElement.material.color = c;

         // modelTreeBuilder.setColorByGroupingPath(building.groupingPath, {
         //    h: hue,
         //    s: saturation,
         //    l: lightness,
         // });
         modelTreeBuilder.setColorByGroupingPath(building.groupingPath, c.getHSL({}));
         modelTreeBuilder.showColorPickerByGroupingPath(building.groupingPath);
      } else {
         modelTreeBuilder.hideColorPickerByGroupingPath(building.groupingPath);
      }

      if (infoPanelBuilder.currentCityElement === buildingElement) {
         if (buildingElement.visible) {
            infoPanelBuilder.drawArrow();
         } else {
            infoPanelBuilder.removeArrow();
         }
      }
   }
};

export { recalculateGlobalNone };
