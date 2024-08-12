import { recalculateMetaphors } from './recalculate-metaphors';

export default class SliderBuilder {
   constructor() {
      this.sliderContainer = document.getElementById('slider-container');
      this.valueDisplay = document.getElementById('slider-value');
      this.sliderThumbT0 = document.getElementById('slider-thumb-t0');
      this.sliderThumbT1 = document.getElementById('slider-thumb-t1');
      this.sliderWindowWidth = document.getElementById('slider-window-width');
      this.lowerRangeBounds = 0;
      this.upperRangeBounds = 0;
   }

   setCityMetaphor(cityMetaphor) {
      this.cityMetaphor = cityMetaphor;
   }

   setCityElements(cityElements) {
      this.cityElements = cityElements;
   }

   setModelTreeBuilder(modelTreeBuilder) {
      this.modelTreeBuilder = modelTreeBuilder;
   }

   setGuiBuilder(guiBuilder) {
      this.guiBuilder = guiBuilder;
   }

   build() {
      this.cityElements.forEach((cityElement) => {
         cityElement.visible = true;
      });

      const lowestTimestamp = this.cityMetaphor.getLowestTimestamp();
      const highestTimestamp = this.cityMetaphor.getHighestTimestamp();
      const deltaTimestamp = highestTimestamp - lowestTimestamp;

      this.valueDisplay.textContent = `${lowestTimestamp} - ${highestTimestamp}`;
      this.sliderContainer.style.display = 'block';

      let isDragging = false;
      let sliderOffsetLeft = 0;
      let draggingSlider = null;

      this.sliderThumbT0.style.left = '0px';
      this.sliderThumbT1.style.left = '0px';
      this.sliderThumbT0.style.zIndex = 1;
      this.sliderThumbT1.style.zIndex = 2;

      this.sliderThumbT0.addEventListener('mousedown', (e) => {
         isDragging = true;
         sliderOffsetLeft =
            e.clientX - this.sliderThumbT0.getBoundingClientRect().left;
         draggingSlider = this.sliderThumbT0;
      });

      this.sliderThumbT1.addEventListener('mousedown', (e) => {
         isDragging = true;
         sliderOffsetLeft =
            e.clientX - this.sliderThumbT1.getBoundingClientRect().left;
         draggingSlider = this.sliderThumbT1;
      });

      document.addEventListener('mouseup', () => {
         isDragging = false;
         sliderOffsetLeft = 0;
      });

      document.addEventListener('mousemove', (e) => {
         if (!isDragging) return;

         const slider = this.sliderContainer;
         const sliderProgressInPixel =
            e.clientX - slider.getBoundingClientRect().left - sliderOffsetLeft;
         let newSliderProgressInPixel = Math.min(
            slider.clientWidth - draggingSlider.clientWidth,
            Math.max(0, sliderProgressInPixel),
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
            draggingSlider.style.left = newSliderProgressInPixel + 'px';
         }

         if (draggingSlider === this.sliderThumbT0) {
            this.sliderThumbT0.style.zIndex = 2;
            this.sliderThumbT1.style.zIndex = 1;
         } else {
            this.sliderThumbT1.style.zIndex = 2;
            this.sliderThumbT0.style.zIndex = 1;
         }

         this.sliderWindowWidth.style.left =
            parseInt(this.sliderThumbT0.style.left) + 10 + 'px';
         this.sliderWindowWidth.style.width =
            parseInt(this.sliderThumbT1.style.left) -
            parseInt(this.sliderThumbT0.style.left) +
            'px';

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

         recalculateMetaphors(
            this.cityMetaphor,
            this.cityElements,
            this.modelTreeBuilder,
            this,
            this.guiBuilder,
         );
      });
   }

   destroy() {
      document.getElementById('slider-window-width').style.width = '0px';
      document.getElementById('slider-container').style.display = 'none';
   }
}
