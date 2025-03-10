import { planeHeight } from "./config";
import * as THREE from "three";

/**
 * Class responsible for building the planes based on the grouping path of each building.
 * A plane contains its children elements, and defines a new zero point for the children.
 */

export default class PlaneBuilder {
   constructor() {
      this.type = "PlaneBuilder";
      const basePlane = this.#createPlane("base_plane");
      this.planes = [basePlane];
   }

   build(buildings) {
      buildings.forEach((building) => {
         const groupingPathLayers = building.groupingPath.split("/");
         for (let i = 1; i < groupingPathLayers.length; i++) {
            const foundPlane = this.planes.find(
               (plane) =>
                  plane.groupingPath ===
                  groupingPathLayers.slice(0, i).join("/")
            );

            if (foundPlane) {
               continue;
            }

            const plane = this.#createPlane(
               groupingPathLayers.slice(0, i).join("/")
            );

            if (plane.groupingPath === "") {
               continue;
            }

            this.planes.push(plane);
         }
      });

      return this.planes;
   }

   #createPlane(groupingPath) {
      const plane = new THREE.Group();
      plane.elementType = "plane";
      plane.groupingPath = groupingPath;

      plane.position.y = planeHeight;

      plane.setBaseColor = (color) => {
         plane.baseColor = color;
      };

      plane.highlight = () => {
         plane.children[0].material.color.setHSL(0, 0, 1);
      };

      plane.unhighlight = () => {
         plane.children[0].material.color.setHSL(0, 0, 0.8);
      };

      const groupGeometry = new THREE.BoxGeometry();
      const groupMaterial = new THREE.MeshBasicMaterial({
         color: new THREE.Color().setHSL(0, 0, 0.8),
         polygonOffset: true,
         polygonOffsetFactor: 0.1,
         polygonOffsetUnits: 0.1,
      });

      const groupBox = new THREE.Mesh(groupGeometry, groupMaterial);

      const wireframeGeometry = new THREE.EdgesGeometry(groupBox.geometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
         color: new THREE.Color().setHSL(0, 0, 0),
         transparent: true,
      });
      const wireframe = new THREE.LineSegments(
         wireframeGeometry,
         wireframeMaterial
      );

      groupBox.add(wireframe);

      plane.add(groupBox);

      return plane;
   }

   destroy() {}
}
