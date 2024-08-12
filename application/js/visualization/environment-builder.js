import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class EnvironmentBuilder {
   constructor() {}

   setCityMetaphor(cityMetaphor) {
      this.cityMetaphor = cityMetaphor;
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
      renderer.domElement.id = 'threejs-canvas';
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(new THREE.Color().setHSL(0, 0, 0.8));
      renderer.xr.enabled = true;
      document.body.appendChild(renderer.domElement);

      // Scene
      const scene = new THREE.Scene();

      // Light
      const ambientLight = new THREE.AmbientLight(
         new THREE.Color(0xffffff, 1.0).setHSL(0, 0, 1),
      );
      const directionalLight = new THREE.DirectionalLight(
         new THREE.Color(0xffffff, 1.0).setHSL(0, 0, 1),
      );
      directionalLight.position.set(50, 50, 50);

      scene.add(ambientLight);
      scene.add(directionalLight);

      // Camera
      const camera = new THREE.PerspectiveCamera(
         75,
         window.innerWidth / window.innerHeight,
         0.8,
         2000,
      );
      camera.position.set(20, 20, 20);
      const orbit = new OrbitControls(camera, renderer.domElement);
      orbit.update();

      // Window resize
      window.onresize = () => {
         renderer.setPixelRatio(window.devicePixelRatio);
         renderer.setSize(window.innerWidth, window.innerHeight);
         camera.aspect = window.innerWidth / window.innerHeight;
         camera.updateProjectionMatrix();
      };

      // Mouse controls
      renderer.domElement.addEventListener('mousedown', (e) => {
         const mouse = new THREE.Vector2();
         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
         mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
         this.mousePosition = mouse;
      });

      renderer.domElement.addEventListener('mouseup', (e) => {
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
                  intersect.object.elementType === 'building' &&
                  intersect.object.visible
               ) {
                  this.infoPanelBuilder.setCurrentCityElement(intersect.object);
                  this.infoPanelBuilder.build();
                  break;
               } else if (intersect.object.parent.elementType === 'plane') {
                  this.infoPanelBuilder.setCurrentCityElement(
                     intersect.object.parent,
                  );
                  this.infoPanelBuilder.build();
                  break;
               }
            }
         }
      });

      let highlightedElement = null;
      renderer.domElement.addEventListener('mousemove', (e) => {
         const mouse = new THREE.Vector2();
         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
         mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

         const raycaster = new THREE.Raycaster();
         raycaster.setFromCamera(mouse, camera);

         const intersects = raycaster.intersectObjects(scene.children);

         if (intersects.length === 0) {
            if (highlightedElement) {
               highlightedElement.unhighlight();
               this.modelTreeBuilder.unhighlightElementByGroupingPath(
                  highlightedElement.groupingPath,
               );
               highlightedElement = null;
            }
         }

         for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.visible) {
               let intersect = null;
               if (intersects[i].object.elementType === 'building') {
                  intersect = intersects[i].object;
               } else if (intersects[i].object.parent.elementType === 'plane') {
                  intersect = intersects[i].object.parent;
               } else {
                  continue;
               }
               if (highlightedElement === intersect) {
                  break;
               }
               if (highlightedElement) {
                  highlightedElement.unhighlight();
                  this.modelTreeBuilder.unhighlightElementByGroupingPath(
                     highlightedElement.groupingPath,
                  );
                  highlightedElement = null;
               }
               highlightedElement = intersect;
               highlightedElement.highlight();
               this.modelTreeBuilder.highlightElementByGroupingPath(
                  highlightedElement.groupingPath,
               );
               break;
            }

            if (i === intersects.length - 1) {
               if (highlightedElement) {
                  highlightedElement.unhighlight();
                  this.modelTreeBuilder.unhighlightElementByGroupingPath(
                     highlightedElement.groupingPath,
                  );
                  highlightedElement = null;
               }
            }
         }
      });

      // Animation
      function animate(time) {
         renderer.render(scene, camera);
      }
      renderer.setAnimationLoop(animate);

      return {
         renderer,
         scene,
         camera,
      };
   }

   destroy() {
      let canvasElement = document.getElementById('threejs-canvas');
      if (canvasElement) {
         canvasElement.remove();
      }
   }
}
