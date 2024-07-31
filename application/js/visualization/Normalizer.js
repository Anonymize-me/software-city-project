class Normalizer {
   dimensionRange = { min: 0.2, max: 10.0 };
   heightRange = { min: 0.2, max: 50.0 };

   maxDimensionBuilding = 0;
   minDimensionBuilding = 0;
   maxHeightBuilding = 0;
   minHeightBuilding = 0;

   guiScaleValue = 1;
   guiNormalizeValue = 1;
   currentHeightValueMean = 0;

   constructor(treeOfBuildings) {
      this.maxDimensionBuilding = treeOfBuildings.getMaxDimensionBuilding();
      this.minDimensionBuilding = treeOfBuildings.getMinDimensionBuilding();
      this.maxHeightBuilding = treeOfBuildings.getMaxHeightBuilding();
      this.minHeightBuilding = treeOfBuildings.getMinHeightBuilding();
   }

   setGuiScaleValue(value) {
      this.guiScaleValue = value;
   }

   setGuiNormalizeValue(value) {
      this.guiNormalizeValue = value;
   }

   normalizeDimensions(treeOfBuildings) {
      treeOfBuildings.list.forEach((building) => {
         let percent = 100;
         if (this.maxDimensionBuilding === this.minDimensionBuilding) {
            percent = 1;
         } else {
            percent =
               (building.getTotalDimensionValue() - this.minDimensionBuilding) /
               (this.maxDimensionBuilding - this.minDimensionBuilding);
         }
         let normalizedValue =
            (this.dimensionRange.max - this.dimensionRange.min) * percent +
            this.dimensionRange.min;

         building.scale.x = normalizedValue;
         building.scale.z = normalizedValue;
      });
   }

   normalizeHeights(treeOfBuildings) {
      treeOfBuildings.list.forEach((building) => {
         building.scale.y = this.normalizeHeight(
            building.getTotalHeightValue()
         );
         building.currentHeightValue = building.scale.y;
         this.adjustYPosition(building);
      });
   }

   adjustYPosition(building) {
      building.position.y = building.scale.y / 2.0 + 0.1;
   }

   normalizeHeight(height) {
      let percent = 100;
      if (this.maxHeightBuilding === this.minHeightBuilding) {
         percent = 1;
      } else {
         percent =
            (height - this.minHeightBuilding) /
            (this.maxHeightBuilding - this.minHeightBuilding);
      }
      let normalizedHeight =
         (this.heightRange.max - this.heightRange.min) * percent +
         this.heightRange.min;
      if (normalizedHeight > this.currentHeightValueMean) {
         return (
            (this.currentHeightValueMean +
               Math.pow(
                  normalizedHeight - this.currentHeightValueMean,
                  this.guiNormalizeValue
               )) *
            this.guiScaleValue
         );
      } else if (normalizedHeight < this.currentHeightValueMean) {
         return (
            (this.currentHeightValueMean -
               Math.pow(
                  this.currentHeightValueMean - normalizedHeight,
                  this.guiNormalizeValue
               )) *
            this.guiScaleValue
         );
      } else {
         return normalizedHeight * this.guiScaleValue;
      }
   }

   setCurrentHeightValueMean(value) {
      this.currentHeightValueMean = value;
   }

   getCurrentHeightValueMean() {
      return this.currentHeightValueMean;
   }
}

export { Normalizer };
