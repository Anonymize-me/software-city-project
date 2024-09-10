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
             getDataType() === "eye-tracking-java-source-code" &&
             parseInt(entry.timestamp) >= sliderBuilder.lowerRangeBounds &&
            parseInt(entry.timestamp) <= sliderBuilder.upperRangeBounds
         ) {
            lastSeenDimensionValue = parseInt(entry[dimensionMetaphor]);
            lastSeenHeightValue = parseInt(entry[heightMetaphor]);
            lastSeenHueValue = parseInt(entry[hueMetaphor]);
            lastSeenSaturationValue = parseInt(entry[saturationMetaphor]);
            lastSeenLightnessValue = parseInt(entry[lightnessMetaphor]);
         } else if (
             getDataType() === "java-source-code" &&
             parseInt(entry.timestamp) === sliderBuilder.upperRangeBounds
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
         if (maxDimensionValue === minDimensionValue) {
            buildingElement.scale.x = (maxDimension - minDimension) / 2 + minDimension;
            buildingElement.scale.z = buildingElement.scale.x;
         } else {
            buildingElement.scale.x =
                ((lastSeenDimensionValue - minDimension) /
                    (maxDimensionValue - minDimensionValue)) *
                (maxDimension - minDimension) +
                minDimension;
            buildingElement.scale.z = buildingElement.scale.x;
         }
      }

      // Height
      if (maxHeightValue === minHeightValue) {
         buildingElement.scale.y = (maxHeight - minHeight) / 2 + minHeight;
      } else {
         buildingElement.scale.y =
             ((lastSeenHeightValue - minHeight) /
                 (maxHeightValue - minHeightValue)) *
             (maxHeight - minHeight) +
             minHeight;
      }

      // Also take into account the 'scale' value from the dat.gui
      const scaleValue = guiBuilder.optionsHeightMetaphor.scale;

      buildingElement.scale.y *= scaleValue;

      buildingElement.position.y = buildingElement.scale.y / 2 + 0.2;

      // Color
      let hue = null;
      if (buildingElement.baseColor === undefined) {
         if (maxHueValue === minHueValue) {
            hue = maxHue - ((maxHue - minHue) / 2 + minHue);
         } else {
            hue =
             maxHue - (((lastSeenHueValue - minHue) / (maxHueValue - minHueValue)) *
             (maxHue - minHue) +
             minHue);
         }
      } else {
         hue = buildingElement.baseColor.h;
      }

      let saturation = null;
      if (saturationMetaphor !== "") {
         saturation =
             lastSeenSaturationValue <= saturationThreshold
                 ? saturationValueForBuildingsBelowThreshold
                 : 1;
      } else {
            saturation = 1;
      }

      let lightness = null;
      if (maxLightnessValue === minLightnessValue) {
         lightness = (maxLightness - minLightness) / 2 + minLightness;
      } else {
         lightness =
             ((lastSeenLightnessValue - minLightness) /
                 (maxLightnessValue - minLightnessValue)) *
             (maxLightness - minLightness) +
             minLightness;
      }

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
