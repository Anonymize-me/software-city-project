import { getDataType, getEpoques } from "../data.js";
import { recalculateController } from "./aggregates/recalculate-controller.js";

/**
 * Class responsible for handling the slider interface.
 * At the end of the slider logic, the recalculate function is called to update the city elements.
 */

export default class SliderBuilder {
   constructor(data, cityMetaphor) {
      this.type = "SliderBuilder";
      this.data = data;
      this.epoques = getEpoques();
      this.cityMetaphor = cityMetaphor;
      this.sliderContainer = document.getElementById("slider-container");
      this.valueDisplay = document.getElementById("slider-value");
      this.sliderThumbT0 = document.getElementById("slider-thumb-t0");
      this.sliderThumbT1 = document.getElementById("slider-thumb-t1");
      this.sliderWindowWidth = document.getElementById("slider-window-width");
      this.lowerRangeBounds = 0;
      this.upperRangeBounds = 0;
   }

   setCityElements(buildings, planes) {
      this.cityElements = buildings.concat(planes);
      this.planes = planes;
   }

   setModelTreeBuilder(modelTreeBuilder) {
      this.modelTreeBuilder = modelTreeBuilder;
   }

   setGuiBuilder(guiBuilder) {
      this.guiBuilder = guiBuilder;
   }

   setInfoPanelBuilder(infoPanelBuilder) {
      this.infoPanelBuilder = infoPanelBuilder;
   }

   build() {
      if (getDataType() === "generic") {
         this.sliderThumbT0.style.display = "block";
         this.sliderThumbT1.innerText = "t1";
         this.sliderWindowWidth.style.display = "block";
      }

      this.cityElements.forEach((cityElement) => {
         cityElement.visible = true;
      });

      const lowestTimestamp = Math.min(
         ...this.data.map((entry) => parseInt(entry.timestamp))
      );
      const highestTimestamp = Math.max(
         ...this.data.map((entry) => parseInt(entry.timestamp))
      );
      const deltaTimestamp = highestTimestamp - lowestTimestamp;

      this.valueDisplay.textContent = `${lowestTimestamp} - ${highestTimestamp}`;

      this.sliderContainer.style.display = "block";

      let isDragging = false;
      let sliderOffsetLeft = 0;
      let draggingSlider = null;

      this.sliderThumbT0.style.left = "0px";
      this.sliderThumbT1.style.left = "0px";
      this.sliderThumbT0.style.zIndex = 1;
      this.sliderThumbT1.style.zIndex = 2;

      this.sliderThumbT0.addEventListener("mousedown", (e) => {
         isDragging = true;
         sliderOffsetLeft =
            e.clientX - this.sliderThumbT0.getBoundingClientRect().left;
         draggingSlider = this.sliderThumbT0;
      });

      this.sliderThumbT1.addEventListener("mousedown", (e) => {
         isDragging = true;
         sliderOffsetLeft =
            e.clientX - this.sliderThumbT1.getBoundingClientRect().left;
         draggingSlider = this.sliderThumbT1;
      });

      document.addEventListener("mouseup", () => {
         isDragging = false;
         sliderOffsetLeft = 0;
         draggingSlider = null;
      });

      document.addEventListener("mousemove", (e) => {
         if (!isDragging) return;

         const slider = this.sliderContainer;
         const sliderProgressInPixel =
            e.clientX - slider.getBoundingClientRect().left - sliderOffsetLeft;
         let newSliderProgressInPixel = Math.min(
            slider.clientWidth - draggingSlider.clientWidth,
            Math.max(0, sliderProgressInPixel)
         );

         draggingSlider.style.left = newSliderProgressInPixel + "px";

         if (draggingSlider === this.sliderThumbT0) {
            this.sliderThumbT0.style.zIndex = 2;
            this.sliderThumbT1.style.zIndex = 1;
         } else {
            this.sliderThumbT1.style.zIndex = 2;
            this.sliderThumbT0.style.zIndex = 1;
         }

         this.sliderWindowWidth.style.left =
            parseInt(this.sliderThumbT0.style.left) + 10 + "px";
         this.sliderWindowWidth.style.width =
            parseInt(this.sliderThumbT1.style.left) -
            parseInt(this.sliderThumbT0.style.left) +
            "px";

         const t0ProgressInPixel = parseInt(this.sliderThumbT0.style.left);
         const t0ProgressPercentage =
            t0ProgressInPixel /
            (slider.clientWidth - this.sliderThumbT0.clientWidth);
         this.lowerRangeBounds =
            parseInt(lowestTimestamp) +
            parseInt(t0ProgressPercentage * deltaTimestamp);

         const t1ProgressInPixel = parseInt(this.sliderThumbT1.style.left);
         const t1ProgressPercentage =
            t1ProgressInPixel /
            (slider.clientWidth - this.sliderThumbT1.clientWidth);
         this.upperRangeBounds =
            parseInt(lowestTimestamp) +
            parseInt(t1ProgressPercentage * deltaTimestamp);

         this.valueDisplay.textContent = `${this.lowerRangeBounds} - ${this.upperRangeBounds}`;

         recalculateController(
            this.cityMetaphor,
            this.cityElements,
            this.modelTreeBuilder,
            this,
            this.guiBuilder,
            this.infoPanelBuilder
         );
      });
   }

   destroy() {
      document.getElementById("slider-window-width").style.width = "0px";
      document.getElementById("slider-container").style.display = "none";
   }
}
