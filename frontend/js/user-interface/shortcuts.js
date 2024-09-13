import {showFrameUpload} from "./upload.js";
import {showFrameModelTree} from "./model-tree.js";
import {showFrameInfo} from "./info.js";
import {showFrameMetaphors} from "./metaphors.js";
import {showFrameConfig} from "./config.js";

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        showFrameUpload(false);
        showFrameConfig(false);
        showFrameMetaphors(false);
        showFrameInfo(false);
        showFrameModelTree(false);
    }
});