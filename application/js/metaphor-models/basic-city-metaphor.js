import PlaneDescriptor from "./plane-descriptor";
import BuildingDescriptor from "./building-descriptor";

export default class BasicCityMetaphor {
   constructor(metaphorSelection) {
      this.type = "BasicCityMetaphor";
      this.metaphorSelection = metaphorSelection;
      this.descriptors = [
         new PlaneDescriptor(metaphorSelection),
         new BuildingDescriptor(metaphorSelection),
      ];
   }

   serialize() {}
}
