import {getConfig, getMapping, updateMapping} from "./cookie-manager.js";
import {
    getAttributeNames,
    getDataType, getMetaphorSelection,
    getOriginalData, getParticipants, getTasks,
    getVisualizationData,
    setMetaphorSelection,
    setVisualizationData
} from "../data.js";
import BasicCityMetaphor from "../metaphor-models/basic-city-metaphor.js";
import Director from "../visualization/director.js";
import {showViewData} from "./view-data.js";
import {showFrameModelTree} from "./model-tree.js";
import {showFrameInfo} from "./info.js";
import {enableButtonViewData} from "./navbar.js";

const frameMetaphors = document.getElementById("frame-metaphors");
const buttonCloseFrameMetaphors = document.getElementById("frame-metaphors-button-close");

const groupingPathSelection = document.getElementById("groupingPath-selection");
const timestampSelection = document.getElementById("timestamp-selection");

const dimensionAttributeSelection = document.getElementById("dimension-attribute-selection");
const heightAttributeSelection = document.getElementById("height-attribute-selection");
const hueAttributeSelection = document.getElementById("hue-attribute-selection");
const lightnessAttributeSelection = document.getElementById("lightness-attribute-selection");

const participant = document.getElementById("participant");
const participantLabel = document.getElementById("participant-label");
const taskId = document.getElementById("taskId");
const taskIdLabel = document.getElementById("taskId-label");

const buttonStartVisualize = document.getElementById("button-start-visualize");
const buttonViewData = document.getElementById("button-view-data");

const showFrameMetaphors = (show) => {
    if (show) {
        frameMetaphors.style.display = "block";
    } else {
        frameMetaphors.style.display = "none";
    }
}

const toggleFrameMetaphors = () => {
    showFrameMetaphors(frameMetaphors.style.display === "none" || frameMetaphors.style.display === "");
}

buttonCloseFrameMetaphors.addEventListener("click", () => {
    showFrameMetaphors(false);
});

// After each upload and after defining the config, the metaphors frame needs to get
// populated with the current values.
const prepareMetaphorsFrame = () => {
    dimensionAttributeSelection.replaceChildren();
    heightAttributeSelection.replaceChildren();
    hueAttributeSelection.replaceChildren();
    hueAttributeSelection.appendChild(document.createElement("option"));
    lightnessAttributeSelection.replaceChildren();
    lightnessAttributeSelection.appendChild(document.createElement("option"));

    getAttributeNames().forEach((attributeName) => {
        const newElement = document.createElement("option");
        newElement.value = attributeName;
        newElement.innerText = attributeName;
        dimensionAttributeSelection.appendChild(newElement.cloneNode(true));
        heightAttributeSelection.appendChild(newElement.cloneNode(true));
        hueAttributeSelection.appendChild(newElement.cloneNode(true));
        lightnessAttributeSelection.appendChild(newElement.cloneNode(true));
    });

    participant.style.display = "none";
    participantLabel.style.display = "none";
    taskId.style.display = "none";
    taskIdLabel.style.display = "none";

    if (getDataType() === "generic") {
        participant.replaceChildren();
        participant.appendChild(document.createElement("option"));
        getParticipants().forEach((entry) => {
            let newElement = document.createElement("option");
            newElement.value = entry;
            newElement.innerText = `participant - ${entry}`;
            participant.appendChild(newElement);
        });

        taskId.replaceChildren();
        taskId.appendChild(document.createElement("option"));
        getTasks().forEach((entry) => {
            let newElement = document.createElement("option");
            newElement.value = entry;
            newElement.innerText = `task - ${entry}`;
            taskId.appendChild(newElement);
        });

        participant.style.display = "block";
        participantLabel.style.display = "block";
        taskId.style.display = "block";
        taskIdLabel.style.display = "block";
    }

    let mapping = getMapping();
    if (mapping.length > 0) {
        mapping = JSON.parse(mapping[0].split("=")[1]).mapping;
        dimensionAttributeSelection.value = mapping.dimension;
        heightAttributeSelection.value = mapping.height;
        hueAttributeSelection.value = mapping.hue;
        lightnessAttributeSelection.value = mapping.lightness;
        if (getDataType() === "generic") {
            participant.value = mapping.participant;
            taskId.value = mapping.taskId;
        }
    }

    let config = getConfig();
    if (config.length > 0) {
        config = JSON.parse(getConfig()[0].split("=")[1]).config;
        participant.value = "";
        taskId.value = "";
        if (config.participant === "") {
            participant.disabled = true;
        } else {
            participant.disabled = false;
            participant.value = config.participant;
        }
        if (config.taskId === "") {
            taskId.disabled = true;
        } else {
            taskId.disabled = false;
            taskId.value = config.taskId;
        }
    }
};

// This method starts the visualization process
buttonStartVisualize.addEventListener("click", (e) => {
    e.preventDefault();

    buttonViewData.click();

    let config = getConfig();
    if (config.length > 0) {
        config = JSON.parse(getConfig()[0].split("=")[1]).config;
        groupingPathSelection.value = config.groupingPath;
        timestampSelection.value = config.timestamp;
    }

    const metaphorSelection = {
        groupingPath: groupingPathSelection.value,
        timestamp: timestampSelection.value,
        dimension: dimensionAttributeSelection.value,
        height: heightAttributeSelection.value,
        hue: hueAttributeSelection.value,
        lightness: lightnessAttributeSelection.value,
    };

    if (getDataType() === "generic") {
        metaphorSelection.participant = participant.value;
        metaphorSelection.taskId = taskId.value;
    }

    updateMapping(metaphorSelection);
    setMetaphorSelection(metaphorSelection);

    let data = getOriginalData();

    if (getDataType() === "generic") {
        data = data.filter((entry) => {
            return (
                entry.participant === participant.value.toString() &&
                entry.taskId === taskId.value.toString()
            );
        });
    }

    setVisualizationData(data);

    if (getVisualizationData().length === 0) {
        alert("No data available for the selected participant and task.");
        return;
    }

    const basicCityMetaphor = new BasicCityMetaphor(getMetaphorSelection());

    const director = new Director(basicCityMetaphor, data);

    director.constructCity();

    showFrameMetaphors(false);
    showViewData(false);
    showFrameModelTree(true);
    showFrameInfo(true);
    enableButtonViewData(true);
});

export { showFrameMetaphors, toggleFrameMetaphors, prepareMetaphorsFrame };