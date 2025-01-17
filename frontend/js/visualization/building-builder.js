import * as THREE from "three";

/**
 * This module is responsible for creating THREE.js meshes for buildings.
 * A new building is created for each unique groupingPath in the data.
 */

export default class BuildingBuilder {
   constructor(data, descriptor) {
      this.descriptor = descriptor;
      this.type = descriptor.buildType; //"BuildingBuilder";
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
            color: (new THREE.Color()).setHSL(0, 1, 0.5),
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

         // Set properties regarding the descriptor:
         //
         // COLOR:
         building.material.color.setHSL(
            (!!this.descriptor.hue)? parseFloat(entry[this.descriptor.hue]): 0,
            1,
            (!!this.descriptor.lightness)? parseFloat(entry[this.descriptor.lightness]): 1,
         );
         building.baseColor = building.material.color;
         building.setBaseColor = (color) => {
            // Accept THREE Color objects or their definition
            if(!(color instanceof THREE.Color))
               if(typeof color == "string") color = new THREE.Color(color);
               else if(typeof color == "object")
                  color = (new THREE.Color()).setHSL(color.h, color.s, color.l);
               else new Error('Cannot instanciate THREE.Color with HSL model.');
            building.baseColor = color;
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


         //
         // HOVER (highlight)
         building.gHighlighted = false;
         building.noHighlightHSL = building.baseColor;

         building.highlight = () => {

            if(building.gHighlighted) return;
            building.gHighlighted = true;
            building.noHighlightHSL = building.material.color.getHSL({});
            
            let newColorHSL = { 
               h: building.noHighlightHSL.h, 
               s: building.noHighlightHSL.s, 
               l: building.noHighlightHSL.l
            };

            if (building.noHighlightHSL.l >= 0.5) {
               newColorHSL.l -= 0.5;
            } else {
               newColorHSL.l += 0.5;
            }

            building.material.color = (new THREE.Color()).setHSL(
                newColorHSL.h,
                newColorHSL.s,
                newColorHSL.l
            );
         };

         building.unhighlight = () => {

            if(!building.gHighlighted) return;
            building.gHighlighted = false;

            building.material.color = (new THREE.Color()).setHSL(
               building.noHighlightHSL.h,
               building.noHighlightHSL.s,
               building.noHighlightHSL.l
            );
         };

      });

      return this.buildings;
   }

   destroy() {}
}
