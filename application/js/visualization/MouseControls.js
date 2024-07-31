import * as THREE from "three";
import { Building } from "./Building";
import { Plane } from "./Plane";
import { Mesh } from "three";
import { getListTreeOfBuildings, getMetaphorSelection } from "../data";
import { drawArrow, removeArrow } from "./arrow";

class MouseControls {
   mousePosition = null;
   previousHoverObject = null;
   previousColor = null;
   previousRoofColor = null;
   allModelTreeElements = document.getElementsByClassName("model-tree-element");

   chartBuilding = null;
   chartHeight = null;
   chartHue = null;
   chartLuminance = null;

   arrowObject = null;

   calculateStepSize = (chart) => {
      const chartHeight = chart.height;
      const yStepSize = Math.max(1, Math.floor(chartHeight / 50));
      return yStepSize;
   };

   constructor(document, camera, scene, renderer) {
      renderer.domElement.addEventListener("mousedown", (e) => {
         const mouse = new THREE.Vector2();
         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
         mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
         this.mousePosition = mouse;
      });

      renderer.domElement.addEventListener("mouseup", (e) => {
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

            for (const obj of intersects) {
               if (
                  obj.object.geometry.type === "BoxGeometry" &&
                  obj.object.visible
               ) {
                  let objInfo = {};
                  if (obj.object instanceof Building) {
                     objInfo = {
                        buildingId: obj.object.buildingId,
                        buildingName: obj.object.buildingName,
                        buildingGroupingPath: obj.object.buildingGroupingPath,
                        buildingData: obj.object.buildingData,
                     };
                  } else {
                     objInfo = {
                        nodeName: obj.object.parent.nodeName,
                     };
                  }

                  const frameInfo = document.getElementById("frame-info");
                  frameInfo.style.display = "block";
                  const infoPanelDiv =
                     document.getElementById("info-panel-div");
                  while (infoPanelDiv.firstChild) {
                     infoPanelDiv.removeChild(infoPanelDiv.firstChild);
                  }

                  for (const entry in objInfo) {
                     if (entry === "buildingData") {
                        let newElement = document.createElement("p");
                        newElement.innerHTML = `<strong>${entry}:</strong><br>`;
                        for (const dataEntry of objInfo[entry]) {
                           let dataElement = document.createElement("p");
                           dataElement.innerText = JSON.stringify(dataEntry);
                           newElement.appendChild(dataElement);
                        }
                        infoPanelDiv.appendChild(newElement);
                     } else {
                        let newElement = document.createElement("p");
                        newElement.innerHTML = `<strong>${entry}:</strong><br>${objInfo[entry]}`;
                        infoPanelDiv.appendChild(newElement);
                     }
                  }

                  // clear chart
                  if (this.chartBuilding !== null) {
                     this.chartBuilding.destroy();
                  }
                  if (this.chartHeight !== null) {
                     this.chartHeight.destroy();
                  }
                  if (this.chartHue !== null) {
                     this.chartHue.destroy();
                  }
                  if (this.chartLuminance !== null) {
                     this.chartLuminance.destroy();
                  }

                  if (obj.object instanceof Building) {
                     let building = obj.object;
                     let dataHeightMetaphor = [];
                     let dataHueMetaphor = [];
                     let dataLuminanceMetaphor = [];

                     building.buildingData.forEach((dataEntry) => {
                        dataHeightMetaphor.push({
                           x: dataEntry.timestamp,
                           y: parseFloat(
                              dataEntry[getMetaphorSelection().height]
                           ),
                        });
                        dataHueMetaphor.push({
                           x: dataEntry.timestamp,
                           y: parseFloat(dataEntry[getMetaphorSelection().hue]),
                        });
                        dataLuminanceMetaphor.push({
                           x: dataEntry.timestamp,
                           y: parseFloat(
                              dataEntry[getMetaphorSelection().luminance]
                           ),
                        });
                     });

                     dataHeightMetaphor.sort((a, b) => a.x - b.x);
                     dataHueMetaphor.sort((a, b) => a.x - b.x);
                     dataLuminanceMetaphor.sort((a, b) => a.x - b.x);

                     dataHeightMetaphor = dataHeightMetaphor.map((entry) => {
                        return {
                           x: entry.x,
                           y: entry.y,
                        };
                     });
                     dataHueMetaphor = dataHueMetaphor.map((entry) => {
                        return {
                           x: entry.x,
                           y: entry.y,
                        };
                     });
                     dataLuminanceMetaphor = dataLuminanceMetaphor.map(
                        (entry) => {
                           return {
                              x: entry.x,
                              y: entry.y,
                           };
                        }
                     );

                     let allTimestamps = [];
                     let heightMetaphorDatasets = [];
                     let hueMetaphorDatasets = [];
                     let luminanceMetaphorDatasets = [];

                     getListTreeOfBuildings()[0].list.forEach((building) => {
                        for (let entry of building.buildingData) {
                           if (!allTimestamps.includes(entry.timestamp)) {
                              allTimestamps.push(entry.timestamp);
                           }
                           heightMetaphorDatasets.push({
                              x: entry.timestamp,
                              y: parseFloat(
                                 entry[getMetaphorSelection().height]
                              ),
                           });
                           hueMetaphorDatasets.push({
                              x: entry.timestamp,
                              y: parseFloat(entry[getMetaphorSelection().hue]),
                           });
                           luminanceMetaphorDatasets.push({
                              x: entry.timestamp,
                              y: parseFloat(
                                 entry[getMetaphorSelection().luminance]
                              ),
                           });
                        }
                     });

                     this.chartBuilding = new Chart(
                        document.getElementById("chartBuilding"),
                        {
                           type: "line",
                           data: {
                              labels: dataHeightMetaphor.map(
                                 (entry) => entry.x
                              ),
                              datasets: [
                                 {
                                    label: `Height - ${getMetaphorSelection().height}`,
                                    fill: false,
                                    lineTension: 0,
                                    borderColor: "rgba(255, 99, 71, 1)",
                                    backgroundColor: "rgba(255, 99, 71, 0.75)",
                                    pointStyle: "circle",
                                    pointRadius: 5,
                                    pointHoverRadius: 7.5,
                                    data: dataHeightMetaphor,
                                 },
                                 {
                                    label: `Hue - ${getMetaphorSelection().hue}`,
                                    fill: false,
                                    lineTension: 0,
                                    borderColor: "rgba(131, 218, 71, 1)",
                                    backgroundColor: "rgba(131, 218, 71, 0.75)",
                                    pointStyle: "circle",
                                    pointRadius: 5,
                                    pointHoverRadius: 7.5,
                                    data: dataHueMetaphor,
                                 },
                                 {
                                    label: `Luminance - ${getMetaphorSelection().luminance}`,
                                    fill: false,
                                    lineTension: 0,
                                    borderColor: "rgba(62, 117, 222, 1)",
                                    backgroundColor: "rgba(62, 117, 222, 0.75)",
                                    pointStyle: "circle",
                                    pointRadius: 5,
                                    pointHoverRadius: 7.5,
                                    data: dataLuminanceMetaphor,
                                 },
                              ],
                           },
                           options: {
                              plugins: {
                                 title: {
                                    display: true,
                                    text: "All Metaphors",
                                    font: {
                                       size: 18,
                                    },
                                    padding: {
                                       top: 30,
                                       bottom: 15,
                                    },
                                 },
                                 beforeUpdate: (chart) => {
                                    const yStepSize = calculateStepSize(chart);
                                    chart.options.scales.y.ticks.stepSize =
                                       yStepSize;
                                 },
                              },
                              scales: {
                                 x: {
                                    ticks: {
                                       display: false,
                                    },
                                    title: {
                                       display: true,
                                       text: "timeline",
                                    },
                                    grid: {
                                       display: false,
                                    },
                                 },
                                 y: {
                                    ticks: {
                                       display: true,
                                       stepSize: 1,
                                    },
                                    title: {
                                       display: true,
                                       text: "values",
                                    },
                                    grid: {
                                       display: true,
                                    },
                                 },
                              },
                           },
                        }
                     );

                     this.chartHeight = new Chart(
                        document.getElementById("chartHeight"),
                        {
                           type: "line",
                           data: {
                              datasets: [
                                 {
                                    type: "line",
                                    label: "All Buildings",
                                    data: heightMetaphorDatasets,
                                    order: 2,
                                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                                 },
                                 {
                                    type: "line",
                                    label: "Current Building",
                                    data: dataHeightMetaphor,
                                    order: 1,
                                    backgroundColor: "rgba(54, 162, 235, 1)",
                                 },
                              ],
                              labels: allTimestamps,
                           },
                           options: {
                              plugins: {
                                 title: {
                                    display: true,
                                    text: "Height Metaphor",
                                    font: {
                                       size: 18,
                                    },
                                    padding: {
                                       top: 30,
                                       bottom: 15,
                                    },
                                 },
                                 beforeUpdate: (chart) => {
                                    const yStepSize = calculateStepSize(chart);
                                    chart.options.scales.y.ticks.stepSize =
                                       yStepSize;
                                 },
                              },
                              scales: {
                                 x: {
                                    ticks: {
                                       display: false,
                                    },
                                    title: {
                                       display: true,
                                       text: "timeline",
                                    },
                                    grid: {
                                       display: false,
                                    },
                                 },
                                 y: {
                                    ticks: {
                                       display: true,
                                       stepSize: 1,
                                    },
                                    title: {
                                       display: true,
                                       text: getMetaphorSelection().height,
                                    },
                                    grid: {
                                       display: true,
                                    },
                                 },
                              },
                           },
                        }
                     );

                     this.chartHue = new Chart(
                        document.getElementById("chartHue"),
                        {
                           type: "line",
                           data: {
                              datasets: [
                                 {
                                    type: "line",
                                    label: "All Buildings",
                                    data: hueMetaphorDatasets,
                                    order: 2,
                                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                                 },
                                 {
                                    type: "line",
                                    label: "Current Building",
                                    data: dataHueMetaphor,
                                    order: 1,
                                    backgroundColor: "rgba(54, 162, 235, 1)",
                                 },
                              ],
                              labels: allTimestamps,
                           },
                           options: {
                              plugins: {
                                 title: {
                                    display: true,
                                    text: "Hue Metaphor",
                                    font: {
                                       size: 18,
                                    },
                                    padding: {
                                       top: 30,
                                       bottom: 15,
                                    },
                                 },
                                 beforeUpdate: (chart) => {
                                    const yStepSize = calculateStepSize(chart);
                                    chart.options.scales.y.ticks.stepSize =
                                       yStepSize;
                                 },
                              },
                              scales: {
                                 x: {
                                    ticks: {
                                       display: false,
                                    },
                                    title: {
                                       display: true,
                                       text: "timeline",
                                    },
                                    grid: {
                                       display: false,
                                    },
                                 },
                                 y: {
                                    ticks: {
                                       display: true,
                                       stepSize: 1,
                                    },
                                    title: {
                                       display: true,
                                       text: getMetaphorSelection().hue,
                                    },
                                    grid: {
                                       display: true,
                                    },
                                 },
                              },
                           },
                        }
                     );

                     this.chartLuminance = new Chart(
                        document.getElementById("chartLuminance"),
                        {
                           type: "line",
                           data: {
                              datasets: [
                                 {
                                    type: "line",
                                    label: "All Buildings",
                                    data: luminanceMetaphorDatasets,
                                    order: 2,
                                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                                 },
                                 {
                                    type: "line",
                                    label: "Current Building",
                                    data: dataLuminanceMetaphor,
                                    order: 1,
                                    backgroundColor: "rgba(54, 162, 235, 1)",
                                 },
                              ],
                              labels: allTimestamps,
                           },
                           options: {
                              plugins: {
                                 title: {
                                    display: true,
                                    text: "Luminance Metaphor",
                                    font: {
                                       size: 18,
                                    },
                                    padding: {
                                       top: 30,
                                       bottom: 15,
                                    },
                                 },
                                 beforeUpdate: (chart) => {
                                    const yStepSize = calculateStepSize(chart);
                                    chart.options.scales.y.ticks.stepSize =
                                       yStepSize;
                                 },
                              },
                              scales: {
                                 x: {
                                    ticks: {
                                       display: false,
                                    },
                                    title: {
                                       display: true,
                                       text: "timeline",
                                    },
                                    grid: {
                                       display: false,
                                    },
                                 },
                                 y: {
                                    ticks: {
                                       display: true,
                                       stepSize: 1,
                                    },
                                    title: {
                                       display: true,
                                       text: getMetaphorSelection().luminance,
                                    },
                                    grid: {
                                       display: true,
                                    },
                                 },
                              },
                           },
                        }
                     );

                     // display arrow over the building
                     drawArrow(building);
                  } else {
                     removeArrow();
                  }
                  break;
               }
            }
         }
      });

      renderer.domElement.addEventListener("mousemove", (e) => {
         for (let element of this.allModelTreeElements) {
            element.style.color = "black";
         }

         const mouse = new THREE.Vector2();
         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
         mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

         const raycaster = new THREE.Raycaster();
         raycaster.setFromCamera(mouse, camera);

         let intersects = raycaster.intersectObjects(scene.children);

         if (this.previousHoverObject !== null) {
            if (this.previousHoverObject instanceof Building) {
               this.previousHoverObject.notHighlightBuilding();
            } else if (this.previousHoverObject instanceof Plane) {
               this.previousHoverObject.notHighlightPlane();
            }
            this.previousHoverObject = null;
         }

         intersects = intersects.filter(
            (intersect) =>
               intersect.object instanceof Building ||
               intersect.object instanceof Mesh ||
               intersect.object instanceof Plane
         );
         intersects = intersects.filter(
            (intersect) => intersect.object.visible
         );

         if (intersects.length === 0) {
            return;
         }
         let elementToHighlight = intersects[0].object;
         if (elementToHighlight instanceof Building) {
            elementToHighlight.highlightBuilding();
            for (let modelTreeElement of this.allModelTreeElements) {
               if (modelTreeElement.id === elementToHighlight.uuid) {
                  modelTreeElement.children[0].style.color = "blue";
               }
            }
            this.previousHoverObject = elementToHighlight;
         } else if (elementToHighlight.parent instanceof Plane) {
            elementToHighlight.parent.highlightPlane();
            for (let modelTreeElement of this.allModelTreeElements) {
               if (modelTreeElement.id === elementToHighlight.parent.uuid) {
                  modelTreeElement.children[0].style.color = "blue";
               }
            }
            this.previousHoverObject = elementToHighlight.parent;
         }
      });
   }
}

export { MouseControls };
