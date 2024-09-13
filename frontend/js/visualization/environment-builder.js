import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class EnvironmentBuilder {
   constructor(cityMetaphor) {
      this.type = "EnvironmentBuilder";
   }

   setInfoPanelBuilder(infoPanelBuilder) {
      this.infoPanelBuilder = infoPanelBuilder;
   }

   setModelTreeBuilder(modelTreeBuilder) {
      this.modelTreeBuilder = modelTreeBuilder;
   }

   build() {
      // Renderer
      const renderer = new THREE.WebGLRenderer({
         antialias: true,
      });
      renderer.domElement.id = "threejs-canvas";
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(new THREE.Color().setHSL(0, 0, 0.8));
      renderer.xr.enabled = true;
      document.body.appendChild(renderer.domElement);

      const scene = new THREE.Scene();

      const ambientLight = new THREE.AmbientLight(
         new THREE.Color(0xffffff, 1.0).setHSL(0, 0, 1)
      );
      const directionalLight = new THREE.DirectionalLight(
         new THREE.Color(0xffffff, 1.0).setHSL(0, 0, 1)
      );
      directionalLight.position.set(50, 50, 50);

      scene.add(ambientLight);
      scene.add(directionalLight);

      const camera = new THREE.PerspectiveCamera(
         75,
         window.innerWidth / window.innerHeight,
         0.8,
         2000
      );
      camera.position.set(20, 20, 20);
      const orbit = new OrbitControls(camera, renderer.domElement);
      orbit.update();

      window.onresize = () => {
         renderer.setPixelRatio(window.devicePixelRatio);
         renderer.setSize(window.innerWidth, window.innerHeight);
         camera.aspect = window.innerWidth / window.innerHeight;
         camera.updateProjectionMatrix();
      };

      window.addEventListener("keydown", (e) => {
         if (e.key === "Alt") {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mousePosition, camera);

            const intersects = raycaster.intersectObjects(scene.children);
            for (const intersect of intersects) {
               if (intersect.object.elementType === "building") {
                  this.selectedObject = intersect.object;
                  break;
               } else if (intersect.object.parent.elementType === "plane") {
                  this.selectedObject = intersect.object.parent;
                  break;
               }
            }

            if (!this.selectedObject) {
               return;
            }

            document.body.style.cursor = "grabbing";

            const worldPosition = new THREE.Vector3();
            this.selectedObject.getWorldPosition(worldPosition);

            const planeXZ = new THREE.Plane(
               new THREE.Vector3(0, 1, 0),
               -worldPosition.y
            );
            const intersectPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(planeXZ, intersectPoint);

            this.dragOffset = new THREE.Vector3().subVectors(
               worldPosition,
               intersectPoint
            );
         }
      });

      window.addEventListener("keyup", (e) => {
         if (e.key === "Alt") {
            this.selectedObject = null;
            document.body.style.cursor = "default";
         } else if (e.key === "Escape") {
            this.infoPanelBuilder.removeArrow();
         }
      });

      renderer.domElement.addEventListener("mousedown", (e) => {
         const mouse = new THREE.Vector2();
         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
         mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
         this.mousePosition = mouse;
      });

      renderer.domElement.addEventListener("mouseup", (e) => {
         const mouse = new THREE.Vector2();
         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
         mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

         if (
            mouse.x === this.mousePosition.x &&
            mouse.y === this.mousePosition.y
         ) {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(scene.children);

            for (const intersect of intersects) {
               if (
                  intersect.object.elementType === "building" &&
                  intersect.object.visible
               ) {
                  this.modelTreeBuilder.markAndJumpToElementByGroupingPath(
                      intersect.object.groupingPath);
                  this.infoPanelBuilder.setCurrentCityElement(intersect.object);
                  this.infoPanelBuilder.build();

                  break;
               } else if (intersect.object.parent.elementType === "plane") {
                  this.modelTreeBuilder.markAndJumpToElementByGroupingPath(
                        intersect.object.parent.groupingPath);
                  this.infoPanelBuilder.setCurrentCityElement(
                     intersect.object.parent
                  );
                  this.infoPanelBuilder.build();
                  break;
               }
            }
         }
      });

      let currentHighlightedElement = null;
      renderer.domElement.addEventListener("mousemove", (e) => {
         const mouse = new THREE.Vector2();
         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
         mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
         this.mousePosition = mouse;

         if (this.selectedObject) {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const worldPosition = new THREE.Vector3();
            this.selectedObject.getWorldPosition(worldPosition);

            const planeXZ = new THREE.Plane(
               new THREE.Vector3(0, 1, 0),
               -worldPosition.y
            );

            const intersectPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(planeXZ, intersectPoint);

            intersectPoint.add(this.dragOffset);

            const newWorldPosition = new THREE.Vector3(
               intersectPoint.x,
               worldPosition.y,
               intersectPoint.z
            );

            this.selectedObject.position.copy(
               this.selectedObject.parent.worldToLocal(newWorldPosition)
            );

            if (
               this.infoPanelBuilder.currentCityElement === this.selectedObject
            ) {
               this.infoPanelBuilder.drawArrow();
            }

            return;
         }

         const raycaster = new THREE.Raycaster();
         raycaster.setFromCamera(mouse, camera);

         const intersects = raycaster.intersectObjects(scene.children);

         for (const intersect of intersects) {
            if (
               intersect.object.elementType === "building" &&
               intersect.object.visible
            ) {
               if (currentHighlightedElement === intersect.object) {
                  return;
               } else if (currentHighlightedElement) {
                  currentHighlightedElement.unhighlight();
                  this.modelTreeBuilder.unhighlightElementByGroupingPath(
                     currentHighlightedElement.groupingPath
                  );
               }
               intersect.object.highlight();
               this.modelTreeBuilder.highlightElementByGroupingPath(
                  intersect.object.groupingPath
               );
               currentHighlightedElement = intersect.object;
               return;
            } else if (intersect.object.parent.elementType === "plane") {
               if (currentHighlightedElement === intersect.object.parent) {
                  return;
               } else if (currentHighlightedElement) {
                  currentHighlightedElement.unhighlight();
                  this.modelTreeBuilder.unhighlightElementByGroupingPath(
                     currentHighlightedElement.groupingPath
                  );
               }
               intersect.object.parent.highlight();
               this.modelTreeBuilder.highlightElementByGroupingPath(
                  intersect.object.parent.groupingPath
               );
               currentHighlightedElement = intersect.object.parent;
               return;
            }
         }

         if (currentHighlightedElement) {
            currentHighlightedElement.unhighlight();
            this.modelTreeBuilder.unhighlightElementByGroupingPath(
               currentHighlightedElement.groupingPath
            );
            currentHighlightedElement = null;
         }
      });

      function animate(time) {
         renderer.render(scene, camera);
      }
      renderer.setAnimationLoop(animate);

      return {
         scene,
         camera,
      };
   }

   destroy() {
      let canvasElement = document.getElementById("threejs-canvas");
      if (canvasElement) {
         canvasElement.remove();
      }
   }
}
