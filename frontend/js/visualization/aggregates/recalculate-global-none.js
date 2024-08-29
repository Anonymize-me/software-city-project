import {
   minDimension,
   maxDimension,
   minHeight,
   maxHeight,
   minHue,
   maxHue,
   minLightness,
   maxLightness,
} from "../config";
import * as THREE from "three";
import { getDataType } from "../../data";

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

   let minDimensionValue = 0;
   let maxDimensionValue = 0;
   let maxHeightValue = 0;
   let minHeightValue = 0;
   let maxHueValue = 0;
   let minHueValue = 0;
   let maxLightnessValue = 0;
   let minLightnessValue = 0;

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
         hueValue = parseInt(entry[hueMetaphor]);
         lightnessValue = parseInt(entry[lightnessMetaphor]);

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
            parseInt(entry.timestamp) >= sliderBuilder.lowerRangeBounds &&
            parseInt(entry.timestamp) <= sliderBuilder.upperRangeBounds
         ) {
            lastSeenDimensionValue = parseInt(entry[dimensionMetaphor]);
            lastSeenHeightValue = parseInt(entry[heightMetaphor]);
            lastSeenHueValue = parseInt(entry[hueMetaphor]);
            lastSeenSaturationValue = parseInt(entry[saturationMetaphor]);
            lastSeenLightnessValue = parseInt(entry[lightnessMetaphor]);
         }
      }

      const buildingElement = cityElements.find(
         (cityElement) => cityElement.groupingPath === building.groupingPath
      );

      // Visibility
      buildingElement.visible = lastSeenHeightValue > 0;

      // Dimension
      if (getDataType() === "java-source-code") {
         buildingElement.scale.x =
            ((lastSeenDimensionValue - minDimension) /
               (maxDimensionValue - minDimensionValue)) *
               (maxDimension - minDimension) +
            minDimension;
         buildingElement.scale.z = buildingElement.scale.x;
      }

      // Height
      buildingElement.scale.y =
         ((lastSeenHeightValue - minHeight) /
            (maxHeightValue - minHeightValue)) *
            (maxHeight - minHeight) +
         minHeight;

      // Also take into account the 'scale' and 'normalize' values from the dat.gui
      const scaleValue = guiBuilder.optionsHeightMetaphor.scale;
      const normalizeValue = guiBuilder.optionsHeightMetaphor.normalize;

      buildingElement.scale.y *= scaleValue;
      buildingElement.scale.y /= normalizeValue;

      buildingElement.position.y = buildingElement.scale.y / 2 + 0.2;

      // Color
      let hue = null;
      if (buildingElement.baseColor === undefined) {
         hue =
            ((lastSeenHueValue - minHue) / (maxHueValue - minHueValue)) *
               (maxHue - minHue) +
            minHue;
      } else {
         hue = buildingElement.baseColor.h;
      }

      const saturation =
         lastSeenSaturationValue <= saturationThreshold
            ? saturationValueForBuildingsBelowThreshold
            : 1;

      const lightness =
         ((lastSeenLightnessValue - minLightness) /
            (maxLightnessValue - minLightnessValue)) *
            (maxLightness - minLightness) +
         minLightness;

      if (buildingElement.visible) {
         buildingElement.material.color = new THREE.Color().setHSL(
            hue,
            saturation,
            lightness
         );

         // Update the model tree colors
         modelTreeBuilder.setColorByGroupingPath(building.groupingPath, {
            h: hue,
            s: saturation,
            l: lightness,
         });
         modelTreeBuilder.showColorPickerByGroupingPath(building.groupingPath);
      } else {
         modelTreeBuilder.hideColorPickerByGroupingPath(building.groupingPath);
      }

      // Update arrow
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
