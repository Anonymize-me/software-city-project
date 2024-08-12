import * as THREE from 'three';
import DimensionMetaphor from '../../js/metaphor-models/dimension-metaphor';
import pack from 'bin-pack';

export default class CityElementBuilder {
   constructor() {
      this.cityElements = [];
   }

   setCityMetaphor(cityMetaphor) {
      this.cityMetaphor = cityMetaphor;
   }

   setScene(scene) {
      this.scene = scene;
   }

   build() {
      // Create the city elements
      for (const cityElementDescriptor of this.cityMetaphor
         .cityElementDescriptors) {
         switch (cityElementDescriptor.constructor.name) {
            case 'PlaneDescriptor':
               this.#buildPlaneDescriptor(cityElementDescriptor);
               break;
            case 'BuildingDescriptor':
               this.#buildBuildingDescriptor(cityElementDescriptor);
               break;
            default:
               throw new Error(
                  `Unknown city element descriptor: ${cityElementDescriptor}`,
               );
         }
      }

      // Create hierarchical structure
      for (const cityElement of this.cityElements) {
         const parentPlane = this.#findParentPlane(cityElement);
         if (parentPlane !== null) {
            parentPlane.add(cityElement);
         }
      }

      // Set Dimensions
      this.setBuildingsDimensions(this.cityElements, this.cityMetaphor);

      // Position the city elements
      this.packCityElements(this.cityElements);

      // Adjust Y-position of the Plane elements
      this.adjustPlaneElementsYPosition(this.cityElements);

      this.scene.add(this.cityElements[0]);

      return this.cityElements;
   }

   #buildPlaneDescriptor(planeDescriptor) {
      const plane = new THREE.Group();
      plane.elementType = 'plane';
      this.cityElements.push(plane);

      plane.groupingPath = planeDescriptor.groupingPath;

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
         wireframeMaterial,
      );

      groupBox.add(wireframe);

      plane.add(groupBox);
   }

   #buildBuildingDescriptor(buildingDescriptor) {
      const boxGeometry = new THREE.BoxGeometry();
      const boxMaterial = new THREE.MeshBasicMaterial({
         color: new THREE.Color().setHSL(0, 1, 0.5),
         polygonOffset: true,
         polygonOffsetFactor: 0.1,
         polygonOffsetUnits: 0.1,
      });

      const building = new THREE.Mesh(boxGeometry, boxMaterial);
      building.elementType = 'building';

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

         let highlightedColor = new THREE.Color().setHSL(
            newColorHSL.h,
            newColorHSL.s,
            newColorHSL.l,
         );
         building.material.color = highlightedColor;

         const originalHSL = { h: colorHSL.h, s: colorHSL.s, l: colorHSL.l };

         building.unhighlight = () => {
            let unhighlightedColor = new THREE.Color().setHSL(
               originalHSL.h,
               originalHSL.s,
               originalHSL.l,
            );
            building.material.color = unhighlightedColor;

            building.unhighlight = undefined;
         };
      };

      this.cityElements.push(building);

      building.groupingPath = buildingDescriptor.groupingPath;

      const wireframeGeometry = new THREE.EdgesGeometry(building.geometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
         color: new THREE.Color().setHSL(0, 0, 0),
         transparent: true,
      });
      const wireframe = new THREE.LineSegments(
         wireframeGeometry,
         wireframeMaterial,
      );
      building.add(wireframe);
   }

   #findParentPlane(childCityElement) {
      const parentGroupingPath = childCityElement.groupingPath
         .split(';')
         .slice(0, -1)
         .join(';');

      for (const cityElement of this.cityElements) {
         if (cityElement.groupingPath === parentGroupingPath) {
            return cityElement;
         }
      }

      return null;
   }

   setBuildingsDimensions(cityElements, cityMetaphor) {
      const minDimension = 1;
      const maxDimension = 8;

      const dimensionMetaphorSelection =
         cityMetaphor.getMetaphorSelectionByMetaphorClassName(
            DimensionMetaphor.prototype.constructor.name,
         );

      const buildings = cityMetaphor.cityElementDescriptors.filter(
         (cityElementDescriptor) =>
            cityElementDescriptor.constructor.name === 'BuildingDescriptor',
      );

      const minDimensionMetaphorValue = this.cityMetaphor.getMinValueByMetaphor(
         DimensionMetaphor.prototype.constructor.name,
      );

      const maxDimensionMetaphorValue = this.cityMetaphor.getMaxValueByMetaphor(
         DimensionMetaphor.prototype.constructor.name,
      );

      for (const building of buildings) {
         const dimensionMetaphorValue =
            building.descriptorData[0][dimensionMetaphorSelection];

         const cityElement = cityElements.find(
            (cityElement) => cityElement.groupingPath === building.groupingPath,
         );

         cityElement.scale.x =
            ((dimensionMetaphorValue - minDimension) /
               (maxDimensionMetaphorValue - minDimensionMetaphorValue)) *
               (maxDimension - minDimension) +
            minDimension;
         cityElement.scale.z = cityElement.scale.x;
         cityElement.visible = true;
      }
   }

   packCityElements(cityElements) {
      const planeHeight = 0.2;

      for (let i = cityElements.length - 1; i >= 0; i--) {
         const cityElement = cityElements[i];

         if (cityElement.elementType === 'plane') {
            cityElement.position.y = 0;

            const bins = [];
            const children = cityElement.children.filter(
               (child) =>
                  child.elementType === 'building' ||
                  child.elementType === 'plane',
            );
            for (const child of children) {
               if (child.elementType === 'building') {
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
                     child.elementType === 'building' &&
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

            cityElement.children[0].scale.x = maxX + 0.5;
            cityElement.children[0].scale.z = maxZ + 0.5;
            cityElement.children[0].scale.y = planeHeight;

            for (const child of children) {
               if (
                  child.elementType === 'building' ||
                  child.elementType === 'plane'
               ) {
                  child.position.x -= maxX / 2;
                  child.position.z -= maxZ / 2;
               }
            }
         }
      }
   }

   adjustPlaneElementsYPosition(cityElements) {
      for (const cityElement of cityElements) {
         if (cityElement.elementType === 'plane') {
            cityElement.position.y = 0.2;
         }
      }
   }
}
