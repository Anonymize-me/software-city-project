import * as THREE from "three";
import { getDataType } from "../../data";

const recalculateLocalNone = (
   cityMetaphor,
   cityElements,
   modelTreeBuilder,
   sliderBuilder,
   guiBuilder
) => {
   const minDimension = 0.2;
   const maxDimension = 10;
   const minHeight = 1;
   const maxHeight = 20;
   const minHue = 0;
   const maxHue = 1;
   const minLightness = 0;
   const maxLightness = 1;

   const dimensionMetaphor = cityMetaphor.metaphorSelection.dimension;

   const heightMetaphor = cityMetaphor.metaphorSelection.height;

   const hueMetaphor = cityMetaphor.metaphorSelection.hue;

   const saturationMetaphor = guiBuilder.gui.thresholdParams.dropdown;
   const saturationThreshold = guiBuilder.gui.thresholdParams.threshold;
   const saturationValueForBuildingsBelowThreshold =
      guiBuilder.gui.thresholdParams.saturation;

   const lightnessMetaphor = cityMetaphor.metaphorSelection.lightness;

   let minLastSeenDimensionValue = 0;
   let maxLastSeenDimensionValue = 0;
   let maxLastSeenHeightValue = 0;
   let minLastSeenHeightValue = 0;
   let maxLastSeenHueValue = 0;
   let minLastSeenHueValue = 0;
   let maxLastSeenLightnessValue = 0;
   let minLastSeenLightnessValue = 0;

   const buildings = cityElements.filter(
      (cityElement) => cityElement.elementType === "building"
   );

   for (const building of buildings) {
      let lastSeenDimensionValue = 0;
      let lastSeenHeightValue = 0;
      let lastSeenHueValue = 0;
      let lastSeenLightnessValue = 0;
      for (const entry of building.buildingData) {
         if (
            parseInt(entry.timestamp) >= sliderBuilder.lowerRangeBounds &&
            parseInt(entry.timestamp) <= sliderBuilder.upperRangeBounds
         ) {
            lastSeenDimensionValue = parseInt(entry[dimensionMetaphor]);
            lastSeenHeightValue = parseInt(entry[heightMetaphor]);
            lastSeenHueValue = parseInt(entry[hueMetaphor]);
            lastSeenLightnessValue = parseInt(entry[lightnessMetaphor]);
         }
      }
      if (lastSeenDimensionValue > maxLastSeenDimensionValue) {
         maxLastSeenDimensionValue = lastSeenDimensionValue;
      }
      if (lastSeenDimensionValue < minLastSeenDimensionValue) {
         minLastSeenDimensionValue = lastSeenDimensionValue;
      }
      if (lastSeenHeightValue > maxLastSeenHeightValue) {
         maxLastSeenHeightValue = lastSeenHeightValue;
      }
      if (lastSeenHeightValue < minLastSeenHeightValue) {
         minLastSeenHeightValue = lastSeenHeightValue;
      }
      if (lastSeenHueValue > maxLastSeenHueValue) {
         maxLastSeenHueValue = lastSeenHueValue;
      }
      if (lastSeenHueValue < minLastSeenHueValue) {
         minLastSeenHueValue = lastSeenHueValue;
      }
      if (lastSeenLightnessValue > maxLastSeenLightnessValue) {
         maxLastSeenLightnessValue = lastSeenLightnessValue;
      }
      if (lastSeenLightnessValue < minLastSeenLightnessValue) {
         minLastSeenLightnessValue = lastSeenLightnessValue;
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
               (maxLastSeenDimensionValue - minLastSeenDimensionValue)) *
               (maxDimension - minDimension) +
            minDimension;
         buildingElement.scale.z = buildingElement.scale.x;
      }

      // Height
      buildingElement.scale.y =
         ((lastSeenHeightValue - minHeight) /
            (maxLastSeenHeightValue - minLastSeenHeightValue)) *
            (maxHeight - minHeight) +
         minHeight;

      // Also take into account the 'scale' and 'normalize' values from the dat.gui
      const scaleValue = guiBuilder.optionsHeightMetaphor.scale;
      const normalizeValue = guiBuilder.optionsHeightMetaphor.normalize;

      buildingElement.scale.y *= scaleValue;
      buildingElement.scale.y /= normalizeValue;

      buildingElement.position.y = buildingElement.scale.y / 2 + 0.1;

      // Color
      let hue = null;
      if (buildingElement.baseColor === undefined) {
         hue =
            ((lastSeenHueValue - minHue) /
               (maxLastSeenHueValue - minLastSeenHueValue)) *
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
            (maxLastSeenLightnessValue - minLastSeenLightnessValue)) *
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
   }
};

export { recalculateLocalNone };
