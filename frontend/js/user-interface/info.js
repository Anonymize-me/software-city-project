const frameInfo = document.getElementById("frame-info");
const buttonCloseFrameInfo = document.getElementById("frame-info-button-close");

const showFrameInfo = (show) => {
    if (show) {
        frameInfo.style.display = "block";
    } else {
        frameInfo.style.display = "none";
    }
}

buttonCloseFrameInfo.addEventListener("click", () => {
    showFrameInfo(false);
});

export { showFrameInfo };