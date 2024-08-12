import PlaneDescriptor from './plane-descriptor';
import BuildingDescriptor from './building-descriptor';

export default class CityElementFactory {
   constructor(metaphors) {
      this.metaphors = metaphors;
   }

   createCityElement(cityElementType, data) {
      switch (cityElementType) {
         case 'plane-descriptor':
            return new PlaneDescriptor();
         case 'building-descriptor':
            return new BuildingDescriptor();
         default:
            return null;
      }
   }
}
