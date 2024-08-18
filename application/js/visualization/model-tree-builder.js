import * as THREE from "three";
import { rgbToHsl, hexToRgb, hslToHex } from "../../js/utils";
import { recalculateController } from "./aggregates/recalculate-controller";
import { removeElementAndChildrenWithListeners } from "../utils";
import { getDataType } from "../../js/data";

export default class ModelTreeBuilder {
   constructor(cityMetaphor) {
      this.type = "ModelTreeBuilder";
      this.cityMetaphor = cityMetaphor;
   }

   setCityElements(buildings, planes) {
      this.cityElements = planes.concat(buildings);
   }

   setSliderBuilder(sliderBuilder) {
      this.sliderBuilder = sliderBuilder;
   }

   setGuiBuilder(guiBuilder) {
      this.guiBuilder = guiBuilder;
   }

   build() {
      this.clear();
      let check = [this.cityElements[0]];
      let seen = [];
      let container = document.createElement("div");
      container.id = "model-tree-container";
      let allNewElements = [];

      while (check.length > 0) {
         let current = check.pop();

         if (getDataType() === "java-source-code") {
            if (
               current.elementType === "building" &&
               current.visible === false
            ) {
               continue;
            }
         }

         seen.push(current);
         let filtered = current.children.filter(
            (child) =>
               child.elementType === "building" || child.elementType === "plane"
         );
         filtered.forEach((e) => {
            check.push(e);
         });

         let newElement = document.createElement("div");
         newElement.classList.add("model-tree-element");
         newElement.id = current.uuid;
         newElement.groupingPath = current.groupingPath;

         let colorPicker = document.createElement("input");
         colorPicker.type = "color";
         colorPicker.id = newElement.id;
         colorPicker.value = "#ffffff";

         newElement.getColorPicker = () => {
            return colorPicker;
         };

         if (current.elementType === "building") {
            newElement.type = "building";
            newElement.style.display = "flex";
            newElement.style.alignItems = "center";

            if (current.groupingPath.lastIndexOf(";") !== -1) {
               newElement.innerText = current.groupingPath.substring(
                  current.groupingPath.lastIndexOf(";") + 1
               );
            } else {
               newElement.innerText = current.groupingPath;
            }

            newElement.appendChild(colorPicker);

            colorPicker.addEventListener("input", () => {
               current.setBaseColor(rgbToHsl(hexToRgb(colorPicker.value)));
               recalculateController(
                  this.cityMetaphor,
                  this.cityElements,
                  this,
                  this.sliderBuilder,
                  this.guiBuilder
               );
            });
         } else if (current.elementType === "plane") {
            newElement.type = "plane";
            newElement.expanded = "true";

            let folderElement = document.createElement("div");
            folderElement.classList.add("model-tree-element");
            folderElement.style.fontWeight = "bold";

            if (current.groupingPath.lastIndexOf(";") !== -1) {
               folderElement.innerText =
                  "\u25BF " +
                  current.groupingPath.substring(
                     current.groupingPath.lastIndexOf(";") + 1
                  );
            } else {
               folderElement.innerText = "\u25BF " + current.groupingPath;
            }

            folderElement.style.display = "flex";
            folderElement.style.alignItems = "center";

            folderElement.appendChild(colorPicker);

            colorPicker.value = hslToHex(0, 0, 0.8);

            colorPicker.addEventListener("input", () => {
               current.children[0].material.color = new THREE.Color(
                  colorPicker.value
               );
               current.setBaseColor(rgbToHsl(hexToRgb(colorPicker.value)));
            });

            newElement.appendChild(folderElement);
         }

         allNewElements.push(newElement);

         if (current.groupingPath !== "base_plane") {
            for (let i of allNewElements) {
               if (i.id === current.parent.uuid) {
                  i.appendChild(newElement);
                  if (newElement.type == "building") {
                     newElement.style.marginLeft = "11px";
                  } else {
                     newElement.style.marginLeft = 10 + "px";
                  }
                  break;
               }
            }
         } else {
            container.appendChild(newElement);
         }

         // Listeners
         if (newElement.type === "building" || newElement.type === "plane") {
            let element = newElement;
            if (newElement.type === "plane") {
               element = newElement.childNodes[0];
            }
            element.addEventListener("mouseenter", function () {
               if (current.elementType === "building") {
                  current.highlight();
                  element.style.color = "blue";
               } else {
                  current.highlight();
                  element.style.color = "blue";
               }
            });

            element.addEventListener("mouseleave", function () {
               if (current.elementType === "building") {
                  current.unhighlight();
                  element.style.color = "black";
               } else {
                  current.unhighlight();
                  element.style.color = "black";
               }
            });

            element.addEventListener("click", (e) => {
               if (e.target.type === "color") return;
               if (newElement.type === "building") {
               } else {
                  element.parentElement.expanded =
                     element.parentElement.expanded === "true"
                        ? "false"
                        : "true";
                  let colorPickerElement = element.children[0];
                  element.innerText =
                     element.parentElement.expanded === "true"
                        ? element.innerText.replace("\u25B8", "\u25BF")
                        : element.innerText.replace("\u25BF", "\u25B8");
                  element.appendChild(colorPickerElement);
                  let childrenToToggle = element.parentElement.children;
                  for (let i = 1; i < childrenToToggle.length; i++) {
                     if (childrenToToggle[i].type === "building") {
                        childrenToToggle[i].style.display =
                           childrenToToggle[i].style.display === "none"
                              ? "flex"
                              : "none";
                     } else {
                        childrenToToggle[i].style.display =
                           childrenToToggle[i].style.display === "none"
                              ? "block"
                              : "none";
                     }
                  }
               }
            });
         }
      }
      this.allElements = allNewElements;
      return container;
   }

   setColorByGroupingPath(groupingPath, color) {
      for (const element of this.allElements) {
         if (element.groupingPath === groupingPath) {
            const col = hslToHex(color.h, color.s, color.l);
            element.getColorPicker().value = col;
            break;
         }
      }
   }

   showColorPickerByGroupingPath(groupingPath) {
      for (const element of this.allElements) {
         if (element.groupingPath === groupingPath) {
            element.getColorPicker().style.display = "block";
            break;
         }
      }
   }

   hideColorPickerByGroupingPath(groupingPath) {
      for (const element of this.allElements) {
         if (element.groupingPath === groupingPath) {
            element.getColorPicker().style.display = "none";
            break;
         }
      }
   }

   highlightElementByGroupingPath(groupingPath) {
      for (const element of this.allElements) {
         if (element.groupingPath === groupingPath) {
            element.style.color = "blue";
            break;
         }
      }
   }

   unhighlightElementByGroupingPath(groupingPath) {
      for (const element of this.allElements) {
         if (element.groupingPath === groupingPath) {
            element.style.color = "black";
            break;
         }
      }
   }

   clear() {
      let modelTreeContainer = document.getElementById("model-tree-container");
      removeElementAndChildrenWithListeners(modelTreeContainer);
   }

   destroy() {
      document.getElementById("frame-model-tree").style.display = "none";
      let modelTreeContainer = document.getElementById("model-tree-container");
      removeElementAndChildrenWithListeners(modelTreeContainer);
   }
}
