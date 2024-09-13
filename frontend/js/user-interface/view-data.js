const viewData = document.getElementById("view-data");

const showViewData = (show) => {
    if (show) {
        viewData.style.display = "block";
    } else {
        viewData.style.display = "none";
    }
}

const toggleViewData = () => {
    showViewData(viewData.style.display === "none" || viewData.style.display === "");
}

export { showViewData, toggleViewData };