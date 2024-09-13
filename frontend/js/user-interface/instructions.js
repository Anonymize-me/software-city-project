const instructions = document.getElementById("instructions");

const showInstructions = (show) => {
    if (show) {
        instructions.style.display = "block";
    } else {
        instructions.style.display = "none";
    }
}

export { showInstructions };