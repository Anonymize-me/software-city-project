import {getDataType, processOriginalData} from "../data.js";
import {updateConfig} from "./cookie-manager.js";
import {showSuccessUploadDataAlert} from "./alerts.js";
import {enableButtonMetaphors, enableButtonModelTree} from "./navbar.js";
import {prepareMetaphorsFrame} from "./metaphors.js";

const frameConfig = document.getElementById("frame-config");
const buttonSaveConfig = document.getElementById("button-save-config");
const buttonCloseFrameConfig = document.getElementById("frame-config-button-close");

const groupingPathSelection = document.getElementById("groupingPath-selection");
const timestampSelection = document.getElementById("timestamp-selection");
const participantSelection = document.getElementById("participant-selection");
const taskIdSelection = document.getElementById("taskId-selection");

const showFrameConfig = (show) => {
    if (show) {
        frameConfig.style.display = "block";
    } else {
        frameConfig.style.display = "none";
    }
}

const toggleFrameConfig = () => {
    showFrameConfig(frameConfig.style.display === "none" || frameConfig.style.display === "");
}

buttonCloseFrameConfig.addEventListener("click", () => {
    showFrameConfig(false);
});

buttonSaveConfig.addEventListener("click", () => {

    let config = {
        groupingPath: groupingPathSelection.value,
        timestamp: timestampSelection.value,
    };

    if (getDataType() === "generic") {
        config.participant = participantSelection.value;
        config.taskId = taskIdSelection.value;
    }

    updateConfig(config);

    processOriginalData(config);

    prepareMetaphorsFrame();

    showSuccessUploadDataAlert();

    showFrameConfig(false);

    enableButtonMetaphors(true);
    enableButtonModelTree(true);
});

export { showFrameConfig, toggleFrameConfig };