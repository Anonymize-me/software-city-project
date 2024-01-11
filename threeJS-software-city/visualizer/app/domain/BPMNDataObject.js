import { normalizeHeightToScale, normalizeWidthToScale } from './Utils';

export class BPMNDataObject {
   constructor(data, metaphorSelection) {
      this.buildingName = data.filename;
      this.buildingGroupingPath = data.filename;
      if (metaphorSelection.dimension !== undefined) {
         this.buildingScaleX = parseInt(data[metaphorSelection.dimension]);
      } else {
         this.buildingScaleX = 1;
      }
      this.buildingScaleZ = this.buildingScaleX;
      if (metaphorSelection.height !== undefined) {
         this.buildingScaleY = parseInt(data[metaphorSelection.height]);
      } else {
         this.buildingScaleY = 1;
      }
      this.buildingPositionY = this.buildingScaleY / 2;
      this.buildingColor = 0xb5cb99;
      if (data[metaphorSelection.color] > 3) {
         this.buildingColor = 0xff0000;
      }

      this.buildingData = data;
   }
}
