import * as dat from "dat.gui";
import * as THREE from "three";
import { getAttributeNames, addGui, getNormalizer, getDataStore } from "../data";
import { hexToRgb, rgbToHsl, getMinValueByAttribute, getMaxValueByAttribute } from "../utils";
import { Color } from "../Color";

class Gui extends dat.GUI {

   constructor(listTreeOfBuildings) {
      super();

      this.thresholdParams = {
         dropdown: '',
         threshold: 50,
         saturation: 80
      };

      let onlyNumericalAttributeNames = [''];

      onlyNumericalAttributeNames = onlyNumericalAttributeNames.concat(getAttributeNames().filter(attributeName => {
         return getDataStore().originalData.some(row => {
            return !isNaN(row[attributeName]);
         });
      }));

      let thresholdFolder = this.addFolder("Threshold");
      let dropdownController = thresholdFolder.add(this.thresholdParams, "dropdown", onlyNumericalAttributeNames).name("Attribute")
         .onChange(value => {
            this.thresholdParams.dropdown = value;
            dropdownController.updateDisplay();

            // Compute new min an max values for the selected attribute
            thresholdController.min(getMinValueByAttribute(value, listTreeOfBuildings[0].list));
            thresholdController.max(getMaxValueByAttribute(value, listTreeOfBuildings[0].list));
            thresholdController.updateDisplay();

            if (value === '') {
               disableController(thresholdController);
               disableController(saturationController);

               // Reset all buildings to 100% saturation
               listTreeOfBuildings[0].list.forEach(building => {
                  building.material.color = new THREE.Color(`hsl(${Color.HUE}, 100%, 50%)`);
               });
            } else {
               enableController(thresholdController);
               enableController(saturationController);

               // All buildings with a value of the selected attribute below the threshold will set the saturation
               // to the value of the saturation parameter. All other buildings will be set to 100% saturation.
               listTreeOfBuildings[0].list.forEach(building => {
                  // console.log('building: ', building);
                  let sum = building.buildingData.reduce((acc, row) => {
                     return acc + parseFloat(row[value]);
                  }, 0);
                  if (sum <= this.thresholdParams.threshold) {
                     building.material.color = new THREE.Color(`hsl(${Color.HUE}, ${this.thresholdParams.saturation}%, 50%)`);
                  } else {
                     building.material.color = new THREE.Color(`hsl(${Color.HUE}, 100%, 50%)`);
                  }
               });
            }
         });

      // style the dropdown
      dropdownController.domElement.querySelector('select').style.color = "#2FA1D6";
      dropdownController.domElement.querySelector('select').style.backgroundColor = "#303030";
      dropdownController.domElement.querySelector('select').style.width = "142px";
      dropdownController.domElement.querySelector('select').style.border = "none";
      dropdownController.domElement.querySelector('select').style.outline = "none";
      dropdownController.domElement.querySelector('select').style.marginLeft = "-5px";

      let thresholdController = thresholdFolder.add(this.thresholdParams, "threshold", 0, 50).name("Threshold")
         .onChange(value => {
            console.log('threshold: ', value);
         });

      let saturationController = thresholdFolder.add(this.thresholdParams, "saturation", 0, 100).name("Saturation")
         .onChange(value => {
            console.log('saturation: ', value);
         });

      thresholdFolder.open();

      function disableController(controller) {
         const input = controller.domElement.querySelector('input');
         if (input) {
            input.setAttribute('disabled', true);
            input.classList.add('non-interactable');
         }
         const sliders = controller.domElement.querySelectorAll('.slider, .slider-fg');
         sliders.forEach(slider => {
            slider.style.pointerEvents = 'none';
            slider.style.opacity = '0.5';
         });
      }

      function enableController(controller) {
         const input = controller.domElement.querySelector('input');
         if (input) {
            input.removeAttribute('disabled');
            input.classList.remove('non-interactable');
         }
         const sliders = controller.domElement.querySelectorAll('.slider, .slider-fg');
         sliders.forEach(slider => {
            slider.style.pointerEvents = 'auto';
            slider.style.opacity = '1';
         });
      }

      // Initially disable the threshold and saturation controllers if the dropdown is empty
      if (this.thresholdParams.dropdown === '') {
         disableController(thresholdController);
         disableController(saturationController);
      }

      let metaphorsFolder = this.addFolder("Metaphors");
      metaphorsFolder.open();

      // //////////////////////////
      // Height Metaphor
      // //////////////////////////

      this.optionsHeightMetaphor = {
         scale: 1.0,
         normalize: 1.0,
      };

      let heightMetaphorFolder = metaphorsFolder.addFolder("Height");
      heightMetaphorFolder
         .add(this.optionsHeightMetaphor, "scale", 0.0, 2.0)
         .name("Scale")
         .onChange(value => {
            getNormalizer().setGuiScaleValue(value);
            listTreeOfBuildings[0].list.forEach(building => {
               building.scale.y = getNormalizer().normalizeHeight(building.currentHeightValue);
               building.position.y = building.scale.y / 2 + 0.1;
            });
         });

      heightMetaphorFolder
         .add(this.optionsHeightMetaphor, "normalize", 0.0, 2.0)
         .name("Normalize")
         .onChange(value => {
            getNormalizer().setGuiNormalizeValue(value);
            getNormalizer().setCurrentHeightValueMean(listTreeOfBuildings[0].getCurrentHeightValueMean());
            listTreeOfBuildings[0].list.forEach(building => {
               building.scale.y = getNormalizer().normalizeHeight(building.currentHeightValue);
               building.position.y = building.scale.y / 2 + 0.1;
            });
         });
      heightMetaphorFolder.open();

      // append this gui to the list of guis in the dataStore
      addGui(this);
   }
}

export { Gui }