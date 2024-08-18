import * as THREE from "three";

export default class InfoPanelBuilder {
   constructor(cityMetaphor) {
      this.type = "InfoPanelBuilder";
      this.cityMetaphor = cityMetaphor;
      this.frameInfo = document.getElementById("frame-info");
      this.infoPanelDiv = document.getElementById("info-panel-div");
      this.chartBuilding = null;
      this.chartHeight = null;
      this.chartHue = null;
      this.chartLightness = null;

      this.arrowDirection = new THREE.Vector3(0, -1, 0).normalize();
      this.arrowLength = 4;
      this.arrowOrigin = new THREE.Vector3(0, 0, 0);
      this.arrowHexColor = 0xff0000;
      this.arrowObject = new THREE.ArrowHelper(
         this.arrowDirection,
         this.arrowOrigin,
         this.arrowLength,
         this.arrowHexColor
      );
      this.arrowObject.cityElement = null;
   }

   setCurrentCityElement(cityElement) {
      this.currentCityElement = cityElement;
   }

   setCityElements(buildings, planes) {
      this.cityElements = planes.concat(buildings);
      this.buildings = buildings;
   }

   resetInfo() {
      while (this.infoPanelDiv.firstChild) {
         this.infoPanelDiv.removeChild(this.infoPanelDiv.firstChild);
      }
   }

   resetCharts() {
      if (this.chartBuilding !== null) {
         this.chartBuilding.destroy();
      }
      if (this.chartHeight !== null) {
         this.chartHeight.destroy();
      }
      if (this.chartHue !== null) {
         this.chartHue.destroy();
      }
      if (this.chartLightness !== null) {
         this.chartLightness.destroy();
      }
   }

   build() {
      this.resetInfo();

      let info = {};
      if (this.currentCityElement.elementType === "building") {
         info = {
            buildingId: this.currentCityElement.buildingId,
            buildingName: this.currentCityElement.groupingPath.substring(
               this.currentCityElement.groupingPath.lastIndexOf(";") + 1
            ),
            groupingPath: this.currentCityElement.groupingPath,
            buildingData: this.currentCityElement.buildingData,
         };
      } else {
         info = {
            groupingPath: this.currentCityElement.groupingPath,
         };
      }

      for (const entry in info) {
         if (entry === "buildingData") {
            let newElement = document.createElement("p");
            newElement.innerHTML = `<strong>${entry}:</strong><br>`;
            for (const dataEntry of info[entry]) {
               let dataElement = document.createElement("p");
               dataElement.innerText = JSON.stringify(dataEntry);
               newElement.appendChild(dataElement);
            }
            this.infoPanelDiv.appendChild(newElement);
         } else {
            let newElement = document.createElement("p");
            newElement.innerHTML = `<strong>${entry}:</strong><br>${info[entry]}`;
            this.infoPanelDiv.appendChild(newElement);
         }
      }

      this.frameInfo.style.display = "block";

      this.resetCharts();

      if (this.currentCityElement.elementType !== "building") {
         return;
      }

      this.drawArrow();

      const building = this.currentCityElement;
      let dataHeightMetaphor = [];
      let dataHueMetaphor = [];
      let dataLightnessMetaphor = [];

      building.buildingData.forEach((entry) => {
         dataHeightMetaphor.push({
            x: entry.timestamp,
            y: parseFloat(entry[this.cityMetaphor.metaphorSelection.height]),
         });
         dataHueMetaphor.push({
            x: entry.timestamp,
            y: parseFloat(entry[this.cityMetaphor.metaphorSelection.hue]),
         });
         dataLightnessMetaphor.push({
            x: entry.timestamp,
            y: parseFloat(entry[this.cityMetaphor.metaphorSelection.lightness]),
         });
      });

      dataHeightMetaphor.sort((a, b) => a.x - b.x);
      dataHueMetaphor.sort((a, b) => a.x - b.x);
      dataLightnessMetaphor.sort((a, b) => a.x - b.x);

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
      dataLightnessMetaphor = dataLightnessMetaphor.map((entry) => {
         return {
            x: entry.x,
            y: entry.y,
         };
      });

      const allTimestamps = [];
      const heightMetaphorDatasets = [];
      const hueMetaphorDatasets = [];
      const lightnessMetaphorDatasets = [];

      this.buildings.forEach((building) => {
         for (const entry of building.buildingData) {
            if (!allTimestamps.includes(entry.timestamp)) {
               allTimestamps.push(entry.timestamp);
            }
            heightMetaphorDatasets.push({
               x: entry.timestamp,
               y: parseFloat(entry[this.cityMetaphor.metaphorSelection.height]),
            });
            hueMetaphorDatasets.push({
               x: entry.timestamp,
               y: parseFloat(entry[this.cityMetaphor.metaphorSelection.hue]),
            });
            lightnessMetaphorDatasets.push({
               x: entry.timestamp,
               y: parseFloat(
                  entry[this.cityMetaphor.metaphorSelection.lightness]
               ),
            });
         }
      });

      // Building the Charts
      this.chartBuilding = new Chart(document.getElementById("chartBuilding"), {
         type: "scatter",
         data: {
            labels: dataHeightMetaphor.map((entry) => entry.x),
            datasets: [
               {
                  label: `Height - ${this.cityMetaphor.metaphorSelection.lightness}`,
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
                  label: `Hue - ${this.cityMetaphor.metaphorSelection.hue}`,
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
                  label: `Lightness - ${this.cityMetaphor.metaphorSelection.lightness}`,
                  fill: false,
                  lineTension: 0,
                  borderColor: "rgba(62, 117, 222, 1)",
                  backgroundColor: "rgba(62, 117, 222, 0.75)",
                  pointStyle: "circle",
                  pointRadius: 5,
                  pointHoverRadius: 7.5,
                  data: dataLightnessMetaphor,
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
                  const yStepSize = Math.max(1, Math.floor(chart.height / 50));
                  chart.options.scales.y.ticks.stepSize = yStepSize;
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
      });

      this.chartHeight = new Chart(document.getElementById("chartHeight"), {
         type: "scatter",
         data: {
            datasets: [
               {
                  type: "scatter",
                  label: "All Buildings",
                  data: heightMetaphorDatasets,
                  order: 2,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
               },
               {
                  type: "scatter",
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
                  const yStepSize = Math.max(1, Math.floor(chart.height / 50));
                  chart.options.scales.y.ticks.stepSize = yStepSize;
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
                     text: this.cityMetaphor.metaphorSelection.height,
                  },
                  grid: {
                     display: true,
                  },
               },
            },
         },
      });

      this.chartHue = new Chart(document.getElementById("chartHue"), {
         type: "scatter",
         data: {
            datasets: [
               {
                  type: "scatter",
                  label: "All Buildings",
                  data: hueMetaphorDatasets,
                  order: 2,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
               },
               {
                  type: "scatter",
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
                  const yStepSize = Math.max(1, Math.floor(chart.height / 50));
                  chart.options.scales.y.ticks.stepSize = yStepSize;
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
                     text: this.cityMetaphor.metaphorSelection.hue,
                  },
                  grid: {
                     display: true,
                  },
               },
            },
         },
      });

      this.chartLightness = new Chart(
         document.getElementById("chartLightness"),
         {
            type: "scatter",
            data: {
               datasets: [
                  {
                     type: "scatter",
                     label: "All Buildings",
                     data: lightnessMetaphorDatasets,
                     order: 2,
                     backgroundColor: "rgba(255, 99, 132, 0.2)",
                  },
                  {
                     type: "scatter",
                     label: "Current Building",
                     data: dataLightnessMetaphor,
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
                     text: "Lightness Metaphor",
                     font: {
                        size: 18,
                     },
                     padding: {
                        top: 30,
                        bottom: 15,
                     },
                  },
                  beforeUpdate: (chart) => {
                     const yStepSize = Math.max(
                        1,
                        Math.floor(chart.height / 50)
                     );
                     chart.options.scales.y.ticks.stepSize = yStepSize;
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
                        text: this.cityMetaphor.metaphorSelection.lightness,
                     },
                     grid: {
                        display: true,
                     },
                  },
               },
            },
         }
      );
   }

   drawArrow = () => {
      const element = this.currentCityElement;
      const x = element.position.x;
      const y =
         element.position.y + element.scale.y / 2 + this.arrowLength + 0.2;
      const z = element.position.z;
      this.arrowObject.position.set(x, y, z);
      this.arrowObject.cityElement = element;
      element.parent.add(this.arrowObject);
   };

   removeArrow = () => {
      if (this.arrowObject.parent !== null) {
         this.arrowObject.parent.remove(this.arrowObject);
         this.arrowObject.cityElement = null;
      }
   };

   destroy() {
      this.resetInfo();
      this.resetCharts();
      this.removeArrow();
   }
}
