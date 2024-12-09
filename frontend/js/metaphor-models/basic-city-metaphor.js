import PlaneDescriptor from "./plane-descriptor.js";
import BuildingDescriptor from "./building-descriptor.js";

/**
 * Class representing a basic city metaphor as a collection of different element metaphors.
 */

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
