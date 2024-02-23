import * as THREE from "three";
import { JavaSourceCodeDataObject } from "./JavaSourceCodeDataObject";
import { BPMNDataObject } from "./BPMNDataObject";
import { GenericDataObject } from "./GenericDataObject";

class Building extends THREE.Mesh {
   constructor(buildingId, data, dataType, metaphorSelection, factors) {
      let dataObject;
      switch (dataType) {
         case "java-source-code":
            dataObject = new JavaSourceCodeDataObject(data, metaphorSelection, factors);
            break;
         case "eye-tracking-java-source-code":
            dataObject = new JavaSourceCodeDataObject(data, metaphorSelection, factors);
            break;
         case "eye-tracking-bpmn":
            dataObject = new BPMNDataObject(data, metaphorSelection, factors);
            break;
         default:
            dataObject = new GenericDataObject(data, metaphorSelection, factors);
            break;
      }

      const boxGeometry = new THREE.BoxGeometry();
      const boxMaterial = new THREE.MeshBasicMaterial({
         color: 0xbdeaff,
         polygonOffset: true,
         polygonOffsetFactor: 0.1,
         polygonOffsetUnits: 0.1,
      });
      const rooftopMaterial = new THREE.MeshBasicMaterial({
         color: 0xffffff,
      });

      // set different materials for the rooftop side
      const materials = [
         boxMaterial,
         boxMaterial,
         rooftopMaterial,
         boxMaterial,
         boxMaterial,
         boxMaterial,
      ];

      super(boxGeometry, materials);

      // here, we add the border of the box
      let geo = new THREE.EdgesGeometry(this.geometry);
      let mat = new THREE.LineBasicMaterial({
         color: 0x000000,
         opacity: 0.6,
         transparent: true,
      });
      let wireframe = new THREE.LineSegments(geo, mat);
      this.add(wireframe);

      this.buildingId = buildingId;
      this.buildingName = dataObject.buildingName;
      this.buildingGroupingPath = dataObject.buildingGroupingPath;
      this.scale.x = dataObject.buildingScaleX;
      this.scale.z = dataObject.buildingScaleZ;
      this.position.y = dataObject.buildingPositionY;
      this.originalScaleY = dataObject.buildingScaleY;
      this.scale.y = dataObject.buildingScaleY;
      this.buildingData = dataObject.buildingData;

      // this.castShadow = true;
      // this.receiveShadow = true;
   }

   getHeight() {
      return this.scale.y;
   }
}

export { Building }