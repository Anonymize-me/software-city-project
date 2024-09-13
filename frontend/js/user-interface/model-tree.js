const frameModelTree = document.getElementById("frame-model-tree");
const buttonCloseFrameModelTree = document.getElementById("frame-model-tree-button-close");

const showFrameModelTree = (show) => {
    if (show) {
        frameModelTree.style.display = "block";
    } else {
        frameModelTree.style.display = "none";
    }
}

const toggleFrameModelTree = () => {
    if (frameModelTree.style.display === "none") {
        showFrameModelTree(true);
    } else {
        showFrameModelTree(false);
    }
}

buttonCloseFrameModelTree.addEventListener("click", () => {
    showFrameModelTree(false);
});

export { showFrameModelTree, toggleFrameModelTree };