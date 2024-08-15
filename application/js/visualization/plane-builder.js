import * as THREE from 'three';

export default class PlaneBuilder {
   constructor() {
      this.planes = [];
   }

   build(buildings) {
      buildings.forEach((building) => {
         const groupingPathLayers = building.groupingPath.split(';');
         for (let i = 1; i < groupingPathLayers.length; i++) {
            const foundPlane = this.planes.find(
               (plane) =>
                  plane.groupingPath ===
                  groupingPathLayers.slice(0, i).join(';'),
            );

            if (foundPlane) {
               continue;
            }

            const plane = new THREE.Group();
            this.planes.push(plane);
            plane.elementType = 'plane';
            plane.groupingPath = groupingPathLayers.slice(0, i).join(';');

            plane.position.y = 0.2;

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

            const wireframeGeometry = new THREE.EdgesGeometry(
               groupBox.geometry,
            );
            const wireframeMaterial = new THREE.LineBasicMaterial({
               color: new THREE.Color().setHSL(0, 0, 0),
               transparent: true,
            });
            const wireframe = new THREE.LineSegments(
               wireframeGeometry,
               wireframeMaterial,
            );

            groupBox.add(wireframe);

            plane.add(groupBox);
         }
      });

      return this.planes;
   }

   destroy() {}
}
