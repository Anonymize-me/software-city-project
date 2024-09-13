import * as THREE from "three";

/**
 * This module is responsible for creating THREE.js meshes for buildings.
 * A new building is created for each unique groupingPath in the data.
 */

export default class BuildingBuilder {
   constructor(data) {
      this.type = "BuildingBuilder";
      this.data = data;
      this.nextBuildingId = 1;
      this.buildings = [];
   }

   build() {
      this.data.forEach((entry) => {
         const foundBuilding = this.buildings.find((building) => {
            return building.groupingPath === entry.groupingPath;
         });

         if (foundBuilding) {
            foundBuilding.buildingData.push(entry);
            return;
         }

         const boxGeometry = new THREE.BoxGeometry();
         const boxMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0, 1, 0.5),
            polygonOffset: true,
            polygonOffsetFactor: 0.1,
            polygonOffsetUnits: 0.1,
         });

         const building = new THREE.Mesh(boxGeometry, boxMaterial);
         this.buildings.push(building);
         building.buildingId = this.nextBuildingId++;
         building.elementType = "building";
         building.groupingPath = entry.groupingPath;
         building.buildingData = [entry];

         building.setBaseColor = (color) => {
            building.baseColor = color;
         };

         building.highlight = () => {
            const colorHSL = building.material.color.getHSL({});
            let newColorHSL = { h: colorHSL.h, s: colorHSL.s, l: colorHSL.l };

            if (colorHSL.l >= 0.5) {
               newColorHSL.l -= 0.5;
            } else {
               newColorHSL.l += 0.5;
            }

            building.material.color = new THREE.Color().setHSL(
                newColorHSL.h,
                newColorHSL.s,
                newColorHSL.l
            );

            const originalHSL = { h: colorHSL.h, s: colorHSL.s, l: colorHSL.l };

            building.unhighlight = () => {
               building.material.color = new THREE.Color().setHSL(
                   originalHSL.h,
                   originalHSL.s,
                   originalHSL.l
               );

               building.unhighlight = undefined;
            };
         };

         const wireframeGeometry = new THREE.EdgesGeometry(boxGeometry);
         const wireframeMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(0, 0, 0),
            transparent: true,
         });
         const wireframe = new THREE.LineSegments(
            wireframeGeometry,
            wireframeMaterial
         );

         building.add(wireframe);
      });

      return this.buildings;
   }

   destroy() {}
}
