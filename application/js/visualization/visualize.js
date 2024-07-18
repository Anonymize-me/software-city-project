import * as THREE from "three";
import { Renderer } from "./Renderer";
import { VisualControls } from "./VisualControls";
import { LightSettings } from "./LightSettings";
import { Gui } from "./Gui";
import { MouseControls } from "./MouseControls";
import { addSlider } from "./timeline";
import { createModelTrees } from "./modelTree";
import { getDataType, removeRenderersAndGuis, setListModelTrees } from "../data";


/**
 * Method to visualize the data in dataStore.visualizationData
 * 
 * @param {Object} listTreeOfBuildings A list with all TreeOfBuildings (1 except for java-source-code type)
 */
const visualize = listTreeOfBuildings => {

   removeRenderersAndGuis();

   let listModelTrees = createModelTrees(listTreeOfBuildings);
   setListModelTrees(listModelTrees);

   const renderer = new Renderer();
   document.body.appendChild(renderer.domElement);

   const scene = new THREE.Scene();

   const visualControls = new VisualControls(renderer);

   renderer.render(scene, visualControls.getCamera());

   window.onresize = () => {
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      visualControls.getCamera().aspect = window.innerWidth / window.innerHeight;
      visualControls.getCamera().updateProjectionMatrix();
   };

   const lightSettings = new LightSettings();
   scene.add(lightSettings.getAmbientLight());
   scene.add(lightSettings.getDirectionalLight());

   new MouseControls(document, visualControls.getCamera(), scene, renderer);

   scene.add(listTreeOfBuildings[0].baseNode);

   new Gui(listTreeOfBuildings);

   addSlider(listTreeOfBuildings[0], listModelTrees);

   function animate(time) {
      renderer.render(scene, visualControls.getCamera());
   }
   renderer.setAnimationLoop(animate);
}

export { visualize }