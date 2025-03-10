import * as dat from "dat.gui";
import { recalculateController } from "./aggregates/recalculate-controller";

/**
 * Class responsible for building the dat.gui interface.
 */

export default class GuiBuilder {
   constructor(data, cityMetaphor) {
      this.type = "GuiBuilder";
      this.data = data;
      this.cityMetaphor = cityMetaphor;
   }

   setCityElements(buildings, planes) {
      this.cityElements = buildings.concat(planes);
   }

   setModelTreeBuilder(modelTreeBuilder) {
      this.modelTreeBuilder = modelTreeBuilder;
   }

   setSliderBuilder(sliderBuilder) {
      this.sliderBuilder = sliderBuilder;
   }

   setInfoPanelBuilder(infoPanelBuilder) {
      this.infoPanelBuilder = infoPanelBuilder;
   }

   disableController(controller) {
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

   enableController(controller) {
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

   build(data) {
      this.gui = new dat.GUI();

      this.gui.domElement.style.position = "absolute";
      this.gui.domElement.style.right = "0px";
      this.gui.domElement.style.padding = "0px";
      this.gui.domElement.style.margin = "0px";
      this.gui.width = 200;

      this.gui.thresholdParams = {
         dropdown: "",
         threshold: 50,
         saturation: 0.3,
      };

      let numericalAttributeNames = [""];
      data.forEach((entry) => {
         for (const key in entry) {
            if (!isNaN(entry[key])) {
               numericalAttributeNames.push(key);
            }
         }
      });

      const thresholdFolder = this.gui.addFolder("Saturation");
      const dropdownController = thresholdFolder
         .add(this.gui.thresholdParams, "dropdown", numericalAttributeNames)
         .name("Attribute")
         .onChange((value) => {
            this.gui.thresholdParams.dropdown = value;
            dropdownController.updateDisplay();

            thresholdController.min(
               Math.min(...this.data.map((entry) => parseInt(entry[value])))
            );

            thresholdController.max(
               Math.max(...this.data.map((entry) => parseInt(entry[value])))
            );

            thresholdController.updateDisplay();

            if (value === "") {
               this.disableController(thresholdController);
               this.disableController(saturationController);
            } else {
               this.enableController(thresholdController);
               this.enableController(saturationController);
            }

            recalculateController(
                this.cityMetaphor,
                this.cityElements,
                this.modelTreeBuilder,
                this.sliderBuilder,
                this,
                this.infoPanelBuilder
            );
         });

      dropdownController.domElement.querySelector("select").style.color =
         "#2FA1D6";
      dropdownController.domElement.querySelector(
         "select"
      ).style.backgroundColor = "#303030";
      dropdownController.domElement.querySelector("select").style.width =
         "113px";
      dropdownController.domElement.querySelector("select").style.border =
         "none";
      dropdownController.domElement.querySelector("select").style.outline =
         "none";
      dropdownController.domElement.querySelector("select").style.marginLeft =
         "-5px";

      let thresholdController = thresholdFolder
         .add(this.gui.thresholdParams, "threshold", 0, 0)
         .name("Threshold")
         .onChange((value) => {
            recalculateController(
               this.cityMetaphor,
               this.cityElements,
               this.modelTreeBuilder,
               this.sliderBuilder,
               this,
               this.infoPanelBuilder
            );
         });

      let saturationController = thresholdFolder
         .add(this.gui.thresholdParams, "saturation", 0, 1)
         .name("Level")
         .onChange((value) => {
            recalculateController(
               this.cityMetaphor,
               this.cityElements,
               this.modelTreeBuilder,
               this.sliderBuilder,
               this,
               this.infoPanelBuilder
            );
         });

      thresholdFolder.open();

      if (this.gui.thresholdParams.dropdown === "") {
         this.disableController(thresholdController);
         this.disableController(saturationController);
      }

      let metaphorsFolder = this.gui.addFolder("Metaphors");
      metaphorsFolder.open();

      this.optionsHeightMetaphor = {
         scale: 1.0,
      };

      let heightMetaphorFolder = metaphorsFolder.addFolder("Height");

      heightMetaphorFolder
         .add(this.optionsHeightMetaphor, "scale", 0.0, 2.0)
         .name("Scale")
         .onChange((value) => {
            recalculateController(
               this.cityMetaphor,
               this.cityElements,
               this.modelTreeBuilder,
               this.sliderBuilder,
               this,
               this.infoPanelBuilder
            );
         });

      heightMetaphorFolder.open();

      return this.gui;
   }

   destroy() {
      this.gui.destroy();
   }
}
