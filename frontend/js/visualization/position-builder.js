import { paddingBuildings, paddingPlanes, planeHeight } from "./config";
import pack from "bin-pack";

export default class PositionBuilder {
   constructor() {
      this.type = "PositionBuilder";
   }

   build(buildings, planes) {
      this.elements = [...buildings, ...planes];

      // To add some space between the city elements, add a fixed padding-value to the x and z scale values,
      // and after packaing all elements, remove the fixed padding-value again.
      for (const element of this.elements) {
         if (element.elementType === "building") {
            element.scale.x += paddingBuildings;
            element.scale.z += paddingBuildings;
         } else if (element.elementType === "plane") {
            element.children[0].scale.x += paddingPlanes;
            element.children[0].scale.z += paddingPlanes;
         }
      }

      for (let i = this.elements.length - 1; i >= 0; i--) {
         const element = this.elements[i];

         if (element.elementType === "plane") {
            const bins = [];
            const children = element.children.filter(
               (child) =>
                  child.elementType === "building" ||
                  child.elementType === "plane"
            );
            for (const child of children) {
               if (child.elementType === "building") {
                  bins.push({
                     uuid: child.uuid,
                     width: child.scale.x,
                     height: child.scale.z,
                  });
               } else {
                  bins.push({
                     uuid: child.uuid,
                     width: child.children[0].scale.x,
                     height: child.children[0].scale.z,
                  });
               }
            }

            pack(bins, { inPlace: true });

            let maxX = 0;
            let maxZ = 0;

            for (const bin of bins) {
               for (const child of children) {
                  if (
                     child.elementType === "building" &&
                     child.uuid === bin.uuid
                  ) {
                     if (bin.uuid === child.uuid) {
                        child.position.x = bin.x + bin.width / 2;
                        child.position.z = bin.y + bin.height / 2;
                     }
                  } else {
                     if (bin.uuid === child.uuid) {
                        child.position.x = bin.x + bin.width / 2;
                        child.position.z = bin.y + bin.height / 2;
                     }
                  }
                  if (bin.x + bin.width >= maxX) {
                     maxX = bin.x + bin.width;
                  }
                  if (bin.y + bin.height >= maxZ) {
                     maxZ = bin.y + bin.height;
                  }
               }
            }

            element.children[0].scale.x = maxX + paddingPlanes;
            element.children[0].scale.z = maxZ + paddingPlanes;
            element.children[0].scale.y = planeHeight;

            for (const child of children) {
               if (
                  child.elementType === "building" ||
                  child.elementType === "plane"
               ) {
                  child.position.x -= maxX / 2;
                  child.position.z -= maxZ / 2;
               }
            }
         }
      }

      for (const element of this.elements) {
         if (element.elementType === "building") {
            element.scale.x -= paddingBuildings;
            element.scale.z -= paddingBuildings;
         } else if (element.elementType === "plane") {
            element.children[0].scale.x -= paddingPlanes;
            element.children[0].scale.z -= paddingPlanes;
         }
      }
   }

   destroy() {}
}
