export default class HierarchyBuilder {
   constructor() {}

   build(buildings, planes) {
      this.buildings = buildings;
      this.planes = planes;
      this.elements = buildings.concat(planes);

      for (const element of this.elements) {
         const parentElement = this.findParentElement(element);
         if (parentElement !== null) {
            parentElement.add(element);
         }
      }
   }

   findParentElement(element) {
      const parentGroupingPath = element.groupingPath
         .split(';')
         .slice(0, -1)
         .join(';');

      for (const element of this.elements) {
         if (element.groupingPath === parentGroupingPath) {
            return element;
         }
      }

      return null;
   }

   destroy() {}
}
