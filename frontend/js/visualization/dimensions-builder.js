import { minDimension, maxDimension } from "./config.js";
import { getDataType } from "../data.js";

/**
 * Class that calculates the dimensions of the buildings based on the metaphor.
 * The dimension of a building is determined by the maximum value of the metaphor
 * for each building. The dimension is then scaled to a value between minDimension
 * and maxDimension.
 */

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
         if (getDataType() === "generic") {
            dimensionMetaphorValue = parseFloat(
               building.buildingData[0][dimensionMapping]
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
