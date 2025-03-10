import {showFrameUpload, toggleFrameUpload} from "./upload";
import {destroyCity} from "../utils";
import {showViewData, toggleViewData} from "./view-data.js";
import {showFrameConfig, toggleFrameConfig} from "./config.js";
import {showFrameMetaphors, toggleFrameMetaphors} from "./metaphors.js";
import {showFrameInfo} from "./info.js";
import {toggleFrameModelTree} from "./model-tree.js";
import {showFrameGitHubRepo, toggleFrameGitHubRepo} from "./github-repo.js";

/**
 * This module is only responsible for the navigation bar of the user interface.
 */

const buttonGitHubRepo = document.getElementById("button-github-repo");
const buttonUpload = document.getElementById("button-upload");
const buttonConfig = document.getElementById("button-config");
const buttonMetaphors = document.getElementById("button-metaphors");
const buttonViewData = document.getElementById("button-view-data");
const buttonModelTree = document.getElementById("button-model-tree");

buttonGitHubRepo.addEventListener("click", () => {
   toggleFrameGitHubRepo();
   showFrameUpload(false);
   showFrameConfig(false);
   showFrameMetaphors(false);
   showFrameInfo(false);
   showViewData(false);
});

buttonUpload.addEventListener("click", () => {
   showFrameGitHubRepo(false);
   toggleFrameUpload();
   showFrameConfig(false);
   showFrameMetaphors(false);
   showFrameInfo(false);
   showViewData(false);
});

buttonConfig.addEventListener("click", () => {
   showFrameGitHubRepo(false);
   showFrameUpload(false);
   toggleFrameConfig();
   showViewData(false);
   showFrameInfo(false);
   showViewData(false);
});

buttonMetaphors.addEventListener("click", () => {
   showFrameGitHubRepo(false);
   showFrameUpload(false);
   showFrameConfig(false);
   toggleFrameMetaphors();
   showFrameInfo(false);
   showViewData(false);
});

buttonViewData.addEventListener("click", () => {
   showFrameGitHubRepo(false);
   showFrameUpload(false);
   showFrameConfig(false);
   showFrameMetaphors(false);
   showFrameInfo(false);
   toggleViewData();
   destroyCity();
});

buttonModelTree.addEventListener("click", () => {
   toggleFrameModelTree();
});

const enableButtonConfig = (enable) => {
    buttonConfig.disabled = !enable;
}

const enableButtonViewData = (enable) => {
    buttonViewData.disabled = !enable;
}

const enableButtonMetaphors = (enable) => {
    buttonMetaphors.disabled = !enable;
}

const enableButtonModelTree = (enable) => {
    buttonModelTree.disabled = !enable;
}

export { enableButtonConfig, enableButtonViewData, enableButtonMetaphors, enableButtonModelTree };