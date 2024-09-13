/**
 * This class is responsible for building the hierarchy of the elements
 * based on the grouping path.
 */

export default class HierarchyBuilder {
   constructor() {
      this.type = "HierarchyBuilder";
   }

   build(buildings, planes) {
      this.buildings = buildings;
      this.planes = planes;
      this.elements = buildings.concat(planes);

      for (const element of this.elements) {
         const parentElement = this.#findParentElement(element);
         if (parentElement !== null) {
            parentElement.add(element);
         }
      }

      const basePlane = this.planes[0];
      for (const element of this.elements) {
         if (element.groupingPath === "base_plane") {
            continue;
         }

         if (element.parent === null) {
            basePlane.add(element);
         }
      }
   }

   #findParentElement(element) {
      const parentGroupingPath = element.groupingPath
         .split("/")
         .slice(0, -1)
         .join("/");

      for (const element of this.elements) {
         if (element.groupingPath === parentGroupingPath) {
            return element;
         }
      }

      return null;
   }

   destroy() {}
}
