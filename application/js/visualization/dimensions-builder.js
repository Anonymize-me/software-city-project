export default class DimensionsBuilder {
   constructor(cityMetaphor) {
      this.cityMetaphor = cityMetaphor;
   }

   build(buildings) {
      const dimensionMapping = this.cityMetaphor.metaphorSelection.dimension;

      const minDimension = 1;
      const maxDimension = 8;

      let minDimensionMetaphorValue = Infinity;
      let maxDimensionMetaphorValue = -Infinity;

      buildings.forEach((building) => {
         building.buildingData.forEach((buildingData) => {
            if (
               parseFloat(buildingData[dimensionMapping]) <
               minDimensionMetaphorValue
            ) {
               minDimensionMetaphorValue = parseFloat(
                  buildingData[dimensionMapping],
               );
            }

            if (
               parseFloat(buildingData[dimensionMapping]) >
               maxDimensionMetaphorValue
            ) {
               maxDimensionMetaphorValue = parseFloat(
                  buildingData[dimensionMapping],
               );
            }
         });
      });

      for (const building of buildings) {
         const dimensionMetaphorValue = parseFloat(
            building.buildingData[0][dimensionMapping],
         );

         building.scale.x =
            ((dimensionMetaphorValue - minDimension) /
               (maxDimensionMetaphorValue - minDimensionMetaphorValue)) *
               (maxDimension - minDimension) +
            minDimension;
         building.scale.z = building.scale.x;
         building.visible = true;
      }
   }

   destroy() {}
}
