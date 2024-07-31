import * as dat from "dat.gui";
import {
   getAttributeNames,
   addGui,
   getNormalizer,
   getDataStore,
   getDataType,
} from "../data";
import { getMinValueByAttribute, getMaxValueByAttribute } from "../utils";
import { getLowerRangeBounds, getUpperRangeBounds } from "./timeline";
import { aggregateFunctionNone } from "./aggregateFunctions/none";

class Gui extends dat.GUI {
   constructor(listTreeOfBuildings) {
      super();

      this.thresholdParams = {
         dropdown: "",
         threshold: 50,
         saturation: 0.3,
      };

      let onlyNumericalAttributeNames = [""];

      onlyNumericalAttributeNames = onlyNumericalAttributeNames.concat(
         getAttributeNames().filter((attributeName) => {
            return getDataStore().originalData.some((row) => {
               return !isNaN(row[attributeName]);
            });
         })
      );

      let thresholdFolder = this.addFolder("Threshold");
      let dropdownController = thresholdFolder
         .add(this.thresholdParams, "dropdown", onlyNumericalAttributeNames)
         .name("Attribute")
         .onChange((value) => {
            this.thresholdParams.dropdown = value;
            dropdownController.updateDisplay();

            // Compute new min an max values for the selected attribute
            // first, collect all buildings of all TreeOfBuildings
            let allBuildings = [];
            listTreeOfBuildings.forEach((treeOfBuildings) => {
               allBuildings = allBuildings.concat(treeOfBuildings.list);
            });

            thresholdController.min(
               getMinValueByAttribute(value, allBuildings)
            );
            thresholdController.max(
               getMaxValueByAttribute(value, allBuildings)
            );
            thresholdController.updateDisplay();

            if (value === "") {
               disableController(thresholdController);
               disableController(saturationController);
            } else {
               enableController(thresholdController);
               enableController(saturationController);

               if (getDataType() === "java-source-code") {
               } else {
                  // All buildings with a value of the selected attribute below the threshold will set the saturation
                  // to the value of the saturation parameter. All other buildings will be set to 100% saturation.
                  aggregateFunctionNone(
                     listTreeOfBuildings[0],
                     getLowerRangeBounds(),
                     getUpperRangeBounds()
                  );
               }
            }
         });

      // style the dropdown
      dropdownController.domElement.querySelector("select").style.color =
         "#2FA1D6";
      dropdownController.domElement.querySelector(
         "select"
      ).style.backgroundColor = "#303030";
      dropdownController.domElement.querySelector("select").style.width =
         "142px";
      dropdownController.domElement.querySelector("select").style.border =
         "none";
      dropdownController.domElement.querySelector("select").style.outline =
         "none";
      dropdownController.domElement.querySelector("select").style.marginLeft =
         "-5px";

      let thresholdController = thresholdFolder
         .add(this.thresholdParams, "threshold", 0, 0)
         .name("Threshold")
         .onChange((value) => {
            if (getDataType() === "java-source-code") {
            } else {
               // All buildings with a value of the selected attribute below the threshold will set the saturation
               // to the value of the saturation parameter. All other buildings will be set to 100% saturation.
               aggregateFunctionNone(
                  listTreeOfBuildings[0],
                  getLowerRangeBounds(),
                  getUpperRangeBounds()
               );
            }
         });

      let saturationController = thresholdFolder
         .add(this.thresholdParams, "saturation", 0, 1)
         .name("Saturation")
         .onChange((value) => {
            if (getDataType() === "java-source-code") {
            } else {
               // All buildings with a value of the selected attribute below the threshold will set the saturation
               // to the value of the saturation parameter. All other buildings will be set to 100% saturation.
               aggregateFunctionNone(
                  listTreeOfBuildings[0],
                  getLowerRangeBounds(),
                  getUpperRangeBounds()
               );
            }
         });

      thresholdFolder.open();

      function disableController(controller) {
         const input = controller.domElement.querySelector("input");
         if (input) {
            input.setAttribute("disabled", true);
            input.classList.add("non-interactable");
         }
         const sliders = controller.domElement.querySelectorAll(
            ".slider, .slider-fg"
         );
         sliders.forEach((slider) => {
            slider.style.pointerEvents = "none";
            slider.style.opacity = "0.5";
         });
      }

      function enableController(controller) {
         const input = controller.domElement.querySelector("input");
         if (input) {
            input.removeAttribute("disabled");
            input.classList.remove("non-interactable");
         }
         const sliders = controller.domElement.querySelectorAll(
            ".slider, .slider-fg"
         );
         sliders.forEach((slider) => {
            slider.style.pointerEvents = "auto";
            slider.style.opacity = "1";
         });
      }

      // Initially disable the threshold and saturation controllers if the dropdown is empty
      if (this.thresholdParams.dropdown === "") {
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
         .onChange((value) => {
            for (let treeOfBuildings of listTreeOfBuildings) {
               treeOfBuildings.getNormalizer().setGuiScaleValue(value);
               treeOfBuildings.list.forEach((building) => {
                  building.scale.y = treeOfBuildings
                     .getNormalizer()
                     .normalizeHeight(building.currentHeightValue);
                  building.position.y = building.scale.y / 2 + 0.1;
               });
            }
         });

      heightMetaphorFolder
         .add(this.optionsHeightMetaphor, "normalize", 0.0, 2.0)
         .name("Normalize")
         .onChange((value) => {
            for (let treeOfBuildings of listTreeOfBuildings) {
               treeOfBuildings.getNormalizer().setGuiNormalizeValue(value);
               treeOfBuildings
                  .getNormalizer()
                  .setCurrentHeightValueMean(
                     treeOfBuildings.getCurrentHeightValueMean()
                  );
               treeOfBuildings.list.forEach((building) => {
                  building.scale.y = treeOfBuildings
                     .getNormalizer()
                     .normalizeHeight(building.currentHeightValue);
                  building.position.y = building.scale.y / 2 + 0.1;
               });
            }
         });
      heightMetaphorFolder.open();

      // append this gui to the list of guis in the dataStore
      addGui(this);
   }
}

export { Gui };
