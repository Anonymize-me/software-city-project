import BuildingDescriptor from './building-descriptor';
import GroupingPathMetaphor from './grouping-path-metaphor';
import PlaneDescriptor from './plane-descriptor';

export default class CityMetaphor {
   constructor(data) {
      this.data = data;
      this.nextBuildingId = 0;
      this.registeredMetaphors = [];
      this.cityElementDescriptors = [];
   }

   registerMetaphor(metaphor) {
      this.registeredMetaphors.push(metaphor);
   }

   getRegisteredMetaphors() {
      return this.registeredMetaphors;
   }

   addCityElementDescriptor(cityElementDescriptor) {
      this.cityElementDescriptors.push(cityElementDescriptor);
   }

   getCityElementDescriptors() {
      return this.cityElementDescriptors;
   }

   createCityElementDescriptors() {
      this.data.forEach((entry) => {
         const buildingDescriptor = new BuildingDescriptor(
            this.nextBuildingId++,
         );

         buildingDescriptor.setGroupingPath(entry.groupingPath);

         const existingCityElement = this.cityElementDescriptors.find(
            (cityElement) =>
               cityElement.groupingPath === buildingDescriptor.groupingPath,
         );

         if (existingCityElement) {
            existingCityElement.addDescriptorData(entry);
            this.nextBuildingId--;
            return;
         }

         const groupingPathLayers = buildingDescriptor.groupingPath.split(';');
         for (let i = 1; i < groupingPathLayers.length; i++) {
            const existingLayer = this.cityElementDescriptors.find(
               (cityElement) =>
                  cityElement.groupingPath ===
                  groupingPathLayers.slice(0, i).join(';'),
            );

            if (existingLayer) {
               continue;
            }

            const planeDescriptor = new PlaneDescriptor();
            planeDescriptor.setGroupingPath(
               groupingPathLayers.slice(0, i).join(';'),
            );

            this.addCityElementDescriptor(planeDescriptor);
         }

         this.addCityElementDescriptor(buildingDescriptor);
      });

      this.cityElementDescriptors.forEach((cityElementDescriptor) => {
         const parentPlaneDescriptor = this.#findParentPlaneDescriptor(
            cityElementDescriptor,
         );

         if (parentPlaneDescriptor) {
            parentPlaneDescriptor.addChildDescriptor(cityElementDescriptor);
            cityElementDescriptor.setParentDescriptor(parentPlaneDescriptor);
         }
      });
   }

   #findParentPlaneDescriptor(childElementDescriptor) {
      const parentGroupingPath = childElementDescriptor.groupingPath
         .split(';')
         .slice(0, -1)
         .join(';');

      for (const cityElement of this.cityElementDescriptors) {
         if (cityElement.groupingPath === parentGroupingPath) {
            return cityElement;
         }
      }

      return null;
   }

   getMetaphorSelectionByMetaphorClassName(metaphorClassName) {
      const metaphorSelection = this.registeredMetaphors.find(
         (metaphor) => metaphor.constructor.name === metaphorClassName,
      );
      return metaphorSelection.selectionName;
   }

   getNumericalAttributeNames() {
      let numericalAttributeNames = [];
      this.data.forEach((entry) => {
         for (const key in entry) {
            if (!isNaN(entry[key])) {
               numericalAttributeNames.push(key);
            }
         }
      });
      return numericalAttributeNames;
   }

   getLowestTimestamp() {
      return Math.min(...this.data.map((entry) => parseInt(entry.timestamp)));
   }

   getHighestTimestamp() {
      return Math.max(...this.data.map((entry) => parseInt(entry.timestamp)));
   }

   getMinValueByAttribute(attribute) {
      return Math.min(...this.data.map((entry) => parseInt(entry[attribute])));
   }

   getMaxValueByAttribute(attribute) {
      return Math.max(...this.data.map((entry) => parseInt(entry[attribute])));
   }

   getMinValueByMetaphor(metaphor) {
      const selectionName =
         this.getMetaphorSelectionByMetaphorClassName(metaphor);
      return Math.min(
         ...this.data.map((entry) => parseInt(entry[selectionName])),
      );
   }

   getMaxValueByMetaphor(metaphor) {
      const selectionName =
         this.getMetaphorSelectionByMetaphorClassName(metaphor);
      return Math.max(
         ...this.data.map((entry) => parseInt(entry[selectionName])),
      );
   }
}
