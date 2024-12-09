export default class BuildingDescriptor {
   constructor(metaphorSelection) {
      this.type = "BuildingDescriptor";
      this.buildType = "BuildingBuilder"
      this.dimension = metaphorSelection.dimension;
      this.height = metaphorSelection.height;
      this.hue = metaphorSelection.hue;
      this.saturation = metaphorSelection.saturation;
      this.lightness = metaphorSelection.lightness;
   }

   serialize() {}
}
