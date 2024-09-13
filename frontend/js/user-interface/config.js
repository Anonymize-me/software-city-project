import {getDataType, processOriginalData} from "../data.js";
import {updateConfig} from "./cookie-manager.js";
import {showSuccessUploadDataAlert} from "./alerts.js";
import {enableButtonMetaphors, enableButtonModelTree} from "./navbar.js";
import {prepareMetaphorsFrame} from "./metaphors.js";
import {showFrameUpload} from "./upload.js";

const frameConfig = document.getElementById("frame-config");
const buttonSaveConfig = document.getElementById("button-save-config");
const buttonCloseFrameConfig = document.getElementById("frame-config-button-close");

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
    let config = null;
    if (getDataType() === "generic") {
        config = {
            groupingPath: document.getElementById("groupingPath-selection").value,
            timestamp: document.getElementById("timestamp-selection").value,
            participant: document.getElementById("participant-selection").value,
            taskId: document.getElementById("taskId-selection").value,
        };
    } else if (getDataType() === "git-java") {
        config = {
            groupingPath: document.getElementById("groupingPath-selection").value,
            timestamp: document.getElementById("timestamp-selection").value,
        };
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