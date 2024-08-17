import { getDataType, getEpoques } from "../data";
import { recalculateGlobalNone } from "./aggregations/recalculate-global-none";

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

      if (getDataType() === "java-source-code") {
         this.snapshotInputContainer = document.getElementById(
            "snapshot-input-container"
         );
         this.snapshotInput = document.getElementById("snapshot-input");
         this.snapshotIndex = 0;
      }

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

   build() {
      if (getDataType() === "eye-tracking-java-source-code") {
         this.sliderThumbT0.style.display = "block";
         this.sliderThumbT1.innerText = "t1";
         this.sliderWindowWidth.style.display = "block";
      } else if (getDataType() === "java-source-code") {
         this.sliderThumbT0.style.display = "none";
         this.sliderThumbT1.innerText = "";
         this.sliderWindowWidth.style.display = "none";

         if (getDataType() === "java-source-code") {
            document.getElementById("snapshot-input-container").style.display =
               "none";
         }
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

      if (getDataType() === "eye-tracking-java-source-code") {
         this.valueDisplay.textContent = `${lowestTimestamp} - ${highestTimestamp}`;
      } else if (getDataType() === "java-source-code") {
         this.valueDisplay.textContent = `Commit: 1, ${lowestTimestamp}`;
      }

      this.sliderContainer.style.display = "block";

      let isDragging = false;
      let sliderOffsetLeft = 0;
      let draggingSlider = null;

      this.sliderThumbT0.style.left = "0px";
      this.sliderThumbT1.style.left = "0px";
      this.sliderThumbT0.style.zIndex = 1;
      this.sliderThumbT1.style.zIndex = 2;

      if (getDataType() === "java-source-code") {
         this.snapshotInputContainer.style.display = "block";
         this.snapshotInput.min = 1;
         this.snapshotInput.max = this.epoques.length;
         this.snapshotInput.value = 1;
         this.snapshotInput.addEventListener("input", (e) => {
            if (e.target.value === "") {
               return;
            }
            if (e.target.value < 1) {
               e.target.value = 1;
            }
            if (e.target.value > this.epoques.length) {
               e.target.value = this.epoques.length;
            }

            this.snapshotIndex = parseInt(e.target.value) - 1;

            this.valueDisplay.textContent = `Commit: ${this.snapshotIndex + 1}, ${this.epoques[this.snapshotIndex].timestamp}`;

            const sliderProgress =
               (this.epoques[this.snapshotIndex].timestamp - lowestTimestamp) /
               deltaTimestamp;
            this.sliderThumbT1.style.left =
               sliderProgress * (this.sliderContainer.clientWidth - 20) + "px";

            this.lowerRangeBounds = this.epoques[0].timestamp;
            this.upperRangeBounds = this.epoques[this.snapshotIndex].timestamp;

            recalculateGlobalNone(
               this.cityMetaphor,
               this.cityElements,
               this.modelTreeBuilder,
               this,
               this.guiBuilder
            );

            const modelTree = this.modelTreeBuilder.build();
            const modelTreeFrame = document.getElementById("model-tree");
            modelTreeFrame.appendChild(modelTree);

            recalculateGlobalNone(
               this.cityMetaphor,
               this.cityElements,
               this.modelTreeBuilder,
               this,
               this.guiBuilder
            );
         });
      }

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

         if (
            draggingSlider === this.sliderThumbT0 &&
            newSliderProgressInPixel >= parseInt(this.sliderThumbT1.style.left)
         ) {
            newSliderProgressInPixel = parseInt(this.sliderThumbT1.style.left);
         } else if (
            draggingSlider === this.sliderThumbT1 &&
            newSliderProgressInPixel <= parseInt(this.sliderThumbT0.style.left)
         ) {
            newSliderProgressInPixel = parseInt(this.sliderThumbT0.style.left);
         } else {
            draggingSlider.style.left = newSliderProgressInPixel + "px";
         }

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

         if (getDataType() === "eye-tracking-java-source-code") {
            this.valueDisplay.textContent = `${this.lowerRangeBounds} - ${this.upperRangeBounds}`;

            recalculateGlobalNone(
               this.cityMetaphor,
               this.cityElements,
               this.modelTreeBuilder,
               this,
               this.guiBuilder
            );
         } else if (getDataType() === "java-source-code") {
            const previousSnapshotIndex = this.snapshotIndex;
            for (let i = 0; i < this.epoques.length; i++) {
               if (this.epoques[i].timestamp > this.upperRangeBounds) {
                  break;
               }
               this.snapshotIndex = i;
            }
            this.valueDisplay.textContent = `Commit: ${this.snapshotIndex + 1}, ${this.epoques[this.snapshotIndex].timestamp}`;
            this.upperRangeBounds = this.epoques[this.snapshotIndex].timestamp;
            this.snapshotInput.value = this.snapshotIndex + 1;

            if (previousSnapshotIndex !== this.snapshotIndex) {
               recalculateGlobalNone(
                  this.cityMetaphor,
                  this.cityElements,
                  this.modelTreeBuilder,
                  this,
                  this.guiBuilder
               );

               const modelTree = this.modelTreeBuilder.build();
               const modelTreeFrame = document.getElementById("model-tree");
               modelTreeFrame.appendChild(modelTree);

               recalculateGlobalNone(
                  this.cityMetaphor,
                  this.cityElements,
                  this.modelTreeBuilder,
                  this,
                  this.guiBuilder
               );
            }
         }
      });
   }

   destroy() {
      document.getElementById("slider-window-width").style.width = "0px";
      document.getElementById("slider-container").style.display = "none";

      if (getDataType() === "java-source-code") {
         document.getElementById("snapshot-input-container").style.display =
            "none";
      }
   }
}
