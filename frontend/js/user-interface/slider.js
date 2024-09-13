const sliderValueCopyIcon = document.getElementById("slider-value-copy-icon");
const sliderValueCheckIcon = document.getElementById("slider-value-check-icon");
const commitHash = document.getElementById("commit-hash");

sliderValueCopyIcon.addEventListener("click", () => {

    sliderValueCopyIcon.style.display = 'none';
    sliderValueCheckIcon.style.display = 'block';

    setTimeout(() => {
        sliderValueCopyIcon.style.display = 'block';
        sliderValueCheckIcon.style.display = 'none';
    }, 1000);

    commitHash.select();
    commitHash.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(commitHash.value);
});