const alertSuccessUploadData = document.getElementById("alert-success-upload-data");
const alertSuccessClearData = document.getElementById("alert-success-clear-data");
const buttonCloseAlertSuccessUploadData = document.getElementById("alert-success-upload-data-button-close");
const buttonCloseAlertSuccessClearData = document.getElementById("alert-success-clear-data-button-close");

const showSuccessUploadDataAlert = () => {
    alertSuccessUploadData.style.display = "block";
    $("#alert-success-upload-data").delay(2000).fadeOut(800);
}

const showSuccessClearDataAlert = () => {
    alertSuccessClearData.style.display = "block";
    $("#alert-success-clear-data").delay(2000).fadeOut(800);
}

buttonCloseAlertSuccessUploadData.addEventListener("click", () => {
    alertSuccessUploadData.style.display = "none";
});

buttonCloseAlertSuccessClearData.addEventListener("click", () => {
    alertSuccessClearData.style.display = "none";
});

export { showSuccessUploadDataAlert, showSuccessClearDataAlert };