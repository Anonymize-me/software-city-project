import { minDimension, maxDimension } from "./config";
import { getDataType } from "../data";
import {min} from "three/nodes";

export default class DimensionsBuilder {
   constructor(cityMetaphor) {
      this.type = "DimensionsBuilder";
      this.cityMetaphor = cityMetaphor;
   }

   build(buildings) {
      const dimensionMapping = this.cityMetaphor.metaphorSelection.dimension;

      let minDimensionMetaphorValue = Infinity;
      let maxDimensionMetaphorValue = -Infinity;

      buildings.forEach((building) => {
         building.buildingData.forEach((buildingData) => {
            if (
               parseFloat(buildingData[dimensionMapping]) <
               minDimensionMetaphorValue
            ) {
               minDimensionMetaphorValue = parseFloat(
                  buildingData[dimensionMapping]
               );
            }

            if (
               parseFloat(buildingData[dimensionMapping]) >
               maxDimensionMetaphorValue
            ) {
               maxDimensionMetaphorValue = parseFloat(
                  buildingData[dimensionMapping]
               );
            }
         });
      });

      for (const building of buildings) {
         let dimensionMetaphorValue;
         if (getDataType() === "eye-tracking-java-source-code") {
            dimensionMetaphorValue = parseFloat(
               building.buildingData[0][dimensionMapping]
            );
         } else if (getDataType() === "java-source-code") {
            dimensionMetaphorValue = building.buildingData.reduce(
               (acc, buildingData) => {
                  return Math.max(
                     acc,
                     parseFloat(buildingData[dimensionMapping])
                  );
               },
               0
            );
         }

         let size = null;
         if (maxDimensionMetaphorValue === minDimensionMetaphorValue) {
            size = (maxDimension - minDimension) / 2 + minDimension;
         } else {
            size = ((dimensionMetaphorValue - minDimension) /
                    (maxDimensionMetaphorValue - minDimensionMetaphorValue)) *
                (maxDimension - minDimension) +
                minDimension;
         }
         building.scale.x = size;
         building.scale.z = building.scale.x;
         building.visible = true;
      }
   }

   destroy() {}
}
