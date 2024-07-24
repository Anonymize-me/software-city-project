import { aggregateFunctionNone } from "./aggregateFunctions/none";
import { aggregateFunctionSum } from "./aggregateFunctions/sum";
import { aggregateFunctionIntegralCurve } from "./aggregateFunctions/integralCurve";
import { Plane } from "./Plane.js";

const sliderContainer = document.getElementById("slider-container");
const valueDisplay = document.getElementById("slider-value");
const sliderThumbT0 = document.getElementById("slider-thumb-t0");
const sliderThumbT1 = document.getElementById("slider-thumb-t1");
const sliderWindowWidth = document.getElementById("slider-window-width");

let lowerRangeBounds = 0;
let upperRangeBounds = 0;

const getLowerRangeBounds = () => {
   return lowerRangeBounds;
};

const getUpperRangeBounds = () => {
   return upperRangeBounds;
};

let aggregateFunction = document.getElementById("aggregate-function");

const addSliderJavaSourceCode = (
   treeOfBuildingsList,
   scene,
   listOfModelTrees
) => {
   // only show 1 slider thumb if data type is "java-source-code"
   sliderThumbT0.style.display = "none";
   sliderThumbT1.innerText = "";

   // hide slider window width
   sliderWindowWidth.style.display = "none";

   let modelTreeElement = document.getElementById("model-tree");
   while (modelTreeElement.firstChild) {
      modelTreeElement.removeChild(modelTreeElement.firstChild);
   }
   modelTreeElement.appendChild(listOfModelTrees[0]);

   let i = 0;
   let displayedTreeOfBuildings = treeOfBuildingsList[i];

   const lowestTimestamp = treeOfBuildingsList[i].timestamp;
   const highestTimestamp =
      treeOfBuildingsList[treeOfBuildingsList.length - 1].timestamp;
   const deltaTimestamp = highestTimestamp - lowestTimestamp;

   valueDisplay.textContent = lowestTimestamp;
   sliderContainer.style.display = "block";

   let isDragging = false;
   let SliderOffsetLeft = 0;
   let draggingSlider = null;

   sliderThumbT0.style.left = "0px";
   sliderThumbT1.style.left = "0px";

   aggregateFunction.style.display = "none";

   sliderThumbT1.addEventListener("mousedown", (e) => {
      isDragging = true;
      SliderOffsetLeft = e.clientX - sliderThumbT1.getBoundingClientRect().left;
      draggingSlider = sliderThumbT1;
   });

   document.addEventListener("mouseup", () => {
      isDragging = false;
      SliderOffsetLeft = 0;
      draggingSlider = null;
   });

   document.addEventListener("mousemove", (e) => {
      if (isDragging) {
         // set position of the dragged slider
         const sliderProgressInPixel =
            e.clientX - slider.getBoundingClientRect().left - SliderOffsetLeft;
         let newSliderProgressInPixel = Math.min(
            slider.clientWidth - draggingSlider.clientWidth,
            Math.max(0, sliderProgressInPixel)
         );

         // caculate value for the display
         let sliderProgress =
            newSliderProgressInPixel /
            (slider.clientWidth - draggingSlider.clientWidth);
         let sliderTimestamp =
            parseInt(lowestTimestamp) +
            parseInt(sliderProgress * deltaTimestamp);
         valueDisplay.textContent = sliderTimestamp;

         // redraw the slider
         draggingSlider.style.left = newSliderProgressInPixel + "px";

         // redraw the window-width div
         sliderWindowWidth.style.left =
            parseInt(sliderThumbT0.style.left) + 10 + "px";
         sliderWindowWidth.style.width =
            parseInt(sliderThumbT1.style.left) -
            parseInt(sliderThumbT0.style.left) +
            "px";

         const belowList = treeOfBuildingsList.filter(
            (treeOfBuildings) => treeOfBuildings.timestamp <= sliderTimestamp
         );
         const next = belowList.reduce(
            (max, treeOfBuildings) =>
               treeOfBuildings.timestamp > max.timestamp
                  ? treeOfBuildings
                  : max,
            treeOfBuildingsList[0]
         );
         const newIndex = treeOfBuildingsList.findIndex(
            (treeOfBuildings) => treeOfBuildings === next
         );

         if (newIndex !== i) {
            i = newIndex;
            scene.remove(
               ...scene.children.filter((child) => child instanceof Plane)
            );
            displayedTreeOfBuildings = next;
            scene.add(displayedTreeOfBuildings.baseNode);

            while (modelTreeElement.firstChild) {
               modelTreeElement.removeChild(modelTreeElement.firstChild);
            }
            modelTreeElement.appendChild(listOfModelTrees[newIndex]);
         }
      }
   });
};

const addSlider = (treeOfBuildings, listOfModelTrees) => {
   // show 2 slider thumbs if data type is "eye-tracking"
   sliderThumbT0.style.display = "block";
   sliderThumbT1.innerText = "t1";

   // show slider window width
   sliderWindowWidth.style.display = "block";

   let modelTreeElement = document.getElementById("model-tree");
   while (modelTreeElement.firstChild) {
      modelTreeElement.removeChild(modelTreeElement.firstChild);
   }
   modelTreeElement.appendChild(listOfModelTrees[0]);

   treeOfBuildings.list.forEach((building) => {
      building.visible = false;
   });

   const lowestTimestamp = treeOfBuildings.getLowestTimestamp();
   const highestTimestamp = treeOfBuildings.getHighestTimestamp();
   const deltaTimestamp = highestTimestamp - lowestTimestamp;

   // valueDisplay.textContent = formatDate(lowestTimestamp);
   valueDisplay.textContent = lowestTimestamp;
   sliderContainer.style.display = "block";

   let isDragging = false;
   let SliderOffsetLeft = 0;
   let draggingSlider = null;

   sliderThumbT0.style.left = "0px";
   sliderThumbT1.style.left = "0px";

   aggregateFunction.style.display = "block";

   sliderThumbT0.addEventListener("mousedown", (e) => {
      isDragging = true;
      SliderOffsetLeft = e.clientX - sliderThumbT0.getBoundingClientRect().left;
      draggingSlider = sliderThumbT0;
   });

   sliderThumbT1.addEventListener("mousedown", (e) => {
      isDragging = true;
      SliderOffsetLeft = e.clientX - sliderThumbT1.getBoundingClientRect().left;
      draggingSlider = sliderThumbT1;
   });

   document.addEventListener("mouseup", () => {
      isDragging = false;
      SliderOffsetLeft = 0;
      draggingSlider = null;
   });

   document.addEventListener("mousemove", (e) => {
      if (isDragging) {
         // set position of the dragged slider
         const sliderProgressInPixel =
            e.clientX - slider.getBoundingClientRect().left - SliderOffsetLeft;
         let newSliderProgressInPixel = Math.min(
            slider.clientWidth - draggingSlider.clientWidth,
            Math.max(0, sliderProgressInPixel)
         );

         // if the t0 slider is dragged further right than the t1 slider, we want to prevent that
         // if the t1 slider is dragged further left than the t0 slider, we want to prevent that
         if (
            draggingSlider === sliderThumbT0 &&
            newSliderProgressInPixel >= parseInt(sliderThumbT1.style.left)
         ) {
            newSliderProgressInPixel = parseInt(sliderThumbT1.style.left);
         } else if (
            draggingSlider === sliderThumbT1 &&
            newSliderProgressInPixel <= parseInt(sliderThumbT0.style.left)
         ) {
            newSliderProgressInPixel = parseInt(sliderThumbT0.style.left);
         } else {
            draggingSlider.style.left = newSliderProgressInPixel + "px";
         }
         // the dragging slider should be on top of the other slider
         if (draggingSlider === sliderThumbT0) {
            sliderThumbT0.style.zIndex = 2;
            sliderThumbT1.style.zIndex = 1;
         } else {
            sliderThumbT1.style.zIndex = 2;
            sliderThumbT0.style.zIndex = 1;
         }

         // calculate value for the display
         let sliderProgress =
            newSliderProgressInPixel /
            (slider.clientWidth - draggingSlider.clientWidth);
         let sliderTimestamp =
            parseInt(lowestTimestamp) +
            parseInt(sliderProgress * deltaTimestamp);
         valueDisplay.textContent = sliderTimestamp;

         // redraw the window-width div
         sliderWindowWidth.style.left =
            parseInt(sliderThumbT0.style.left) + 10 + "px";
         sliderWindowWidth.style.width =
            parseInt(sliderThumbT1.style.left) -
            parseInt(sliderThumbT0.style.left) +
            "px";

         // calculate the range (lowerRangeBounds = t0)
         // calculate the range (upperRangeBounds = t1)
         const t0ProgressInPixel = parseInt(sliderThumbT0.style.left);
         const t0ProgressPercentage =
            t0ProgressInPixel /
            (slider.clientWidth - sliderThumbT0.clientWidth);
         lowerRangeBounds =
            parseInt(lowestTimestamp) +
            parseInt(t0ProgressPercentage * deltaTimestamp);
         const t1ProgressInPixel = parseInt(sliderThumbT1.style.left);
         const t1ProgressPercentage =
            t1ProgressInPixel /
            (slider.clientWidth - sliderThumbT1.clientWidth);
         upperRangeBounds =
            parseInt(lowestTimestamp) +
            parseInt(t1ProgressPercentage * deltaTimestamp);

         // here decide which aggregate function to use
         switch (aggregateFunction.value) {
            case "none":
               aggregateFunctionNone(
                  treeOfBuildings,
                  lowerRangeBounds,
                  upperRangeBounds
               );
               break;
            case "sum":
               aggregateFunctionSum(
                  treeOfBuildings,
                  lowerRangeBounds,
                  upperRangeBounds
               );
               break;
            case "integral-curve":
               aggregateFunctionIntegralCurve(
                  treeOfBuildings,
                  lowerRangeBounds,
                  upperRangeBounds
               );
               break;
            default:
               console.log("No aggregate function selected");
               break;
         }
      }
   });
};

export {
   getLowerRangeBounds,
   getUpperRangeBounds,
   addSliderJavaSourceCode,
   addSlider,
   lowerRangeBounds,
   upperRangeBounds,
};
