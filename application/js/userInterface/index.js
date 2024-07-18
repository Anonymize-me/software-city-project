import { clearData, processOriginalData } from '../data';
import { updateConfig } from './cookieManager';
import { uploadData } from './upload';
import { buildTable } from './table';
import { prepareMetaphorsFrame } from './visualize';
import { destroyAndRemoveVisualization } from '../utils';
import { removeArrow } from '../visualization/arrow';

const buttonUpload = document.getElementById('button-upload');
const buttonConfig = document.getElementById('button-config');
const buttonMetaphors = document.getElementById('button-metaphors');
const buttonViewData = document.getElementById('button-view-data');
const buttonClearData = document.getElementById('button-clear-data');
const buttonModelTree = document.getElementById('button-model-tree');

const viewData = document.getElementById('view-data');

const frameUpload = document.getElementById('frame-upload');
const frameConfig = document.getElementById('frame-config');
const frameMetaphors = document.getElementById('frame-metaphors');
const frameModelTree = document.getElementById('frame-model-tree');
const frameInfo = document.getElementById('frame-info');

const buttonsClose = document.getElementsByClassName('button-close');

const buttonUploadData = document.getElementById('button-upload-data');
const buttonSaveConfig = document.getElementById('button-save-config');

const alertSuccessUploadData = document.getElementById(
   'alert-success-upload-data',
);
const alertSuccessClearData = document.getElementById(
   'alert-success-clear-data',
);
const buttonAlertCloseUploadData = document.getElementById(
   'button-alert-close-upload-data',
);
const buttonAlertCloseClearData = document.getElementById(
   'button-alert-close-clear-data',
);

buttonUpload.addEventListener('click', () => {
   frameConfig.style.display = 'none';
   frameMetaphors.style.display = 'none';
   frameInfo.style.display = 'none';
   frameModelTree.style.display = 'none';
   if (
      frameUpload.style.display === 'none' ||
      frameUpload.style.display === ''
   ) {
      frameUpload.style.display = 'block';
   } else {
      frameUpload.style.display = 'none';
   }
});

buttonConfig.addEventListener('click', () => {
   frameUpload.style.display = 'none';
   frameMetaphors.style.display = 'none';
   frameInfo.style.display = 'none';
   frameModelTree.style.display = 'none';
   if (
      frameConfig.style.display === 'none' ||
      frameConfig.style.display === ''
   ) {
      frameConfig.style.display = 'block';
   } else {
      frameConfig.style.display = 'none';
   }
});

buttonMetaphors.addEventListener('click', () => {
   frameUpload.style.display = 'none';
   frameConfig.style.display = 'none';
   frameInfo.style.display = 'none';
   frameModelTree.style.display = 'none';
   if (
      frameMetaphors.style.display === 'none' ||
      frameMetaphors.style.display === ''
   ) {
      frameMetaphors.style.display = 'block';
   } else {
      frameMetaphors.style.display = 'none';
   }
});

buttonViewData.addEventListener('click', () => {
   frameUpload.style.display = 'none';
   frameConfig.style.display = 'none';
   frameMetaphors.style.display = 'none';
   frameInfo.style.display = 'none';
   destroyAndRemoveVisualization();
   viewData.style.display = 'block';
});

buttonModelTree.addEventListener('click', () => {
   if (
      frameModelTree.style.display === 'none' ||
      frameModelTree.style.display === ''
   ) {
      frameModelTree.style.display = 'block';
   } else {
      frameModelTree.style.display = 'none';
   }
});

buttonClearData.addEventListener('click', () => {
   clearData();
   alertSuccessClearData.style.display = 'block';
   $('#alert-success-clear-data').delay(2000).fadeOut(800);
   buildTable();
   toggleConfigAndViewDataButton(true);
   toggleMetaphorsAndModelTreeButton(true);
   // hide table
   document.getElementById('view-data').style.display = 'none';
   // show instructions
   document.getElementById('instructions').style.display = 'block';
});

buttonSaveConfig.addEventListener('click', () => {
   let config = {
      groupingPath: document.getElementById('groupingPath-selection').value,
      timestamp: document.getElementById('timestamp-selection').value,
      participant: document.getElementById('participant-selection').value,
      taskId: document.getElementById('taskId-selection').value,
   };

   // safe config in cookies_manager
   updateConfig(config);

   processOriginalData(config);

   prepareMetaphorsFrame();

   alertSuccessUploadData.style.display = 'block';
   $('#alert-success-upload-data').delay(2000).fadeOut(800);
   frameConfig.style.display = 'none';
   toggleMetaphorsAndModelTreeButton(false);
});

const toggleConfigAndViewDataButton = (boolChoice) => {
   buttonConfig.disabled = boolChoice;
   buttonViewData.disabled = boolChoice;
};

const toggleMetaphorsAndModelTreeButton = (boolChoice) => {
   buttonMetaphors.disabled = boolChoice;
   buttonModelTree.disabled = boolChoice;
};

for (let i = 0; i < buttonsClose.length; i++) {
   buttonsClose[i].addEventListener('click', () => {
      switch (buttonsClose[i].parentElement.id) {
         case 'frame-upload':
            frameUpload.style.display = 'none';
            break;
         case 'frame-config':
            frameConfig.style.display = 'none';
            break;
         case 'frame-metaphors':
            frameMetaphors.style.display = 'none';
            break;
         case 'frame-info':
            frameInfo.style.display = 'none';
            removeArrow();
            break;
         case 'frame-model-tree':
            frameModelTree.style.display = 'none';
            break;
      }
   });
}

document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape') {
      frameUpload.style.display = 'none';
      frameConfig.style.display = 'none';
      frameMetaphors.style.display = 'none';
      frameInfo.style.display = 'none';
      removeArrow();
      frameModelTree.style.display = 'none';
   }
});

buttonUploadData.addEventListener('click', (e) => {
   e.preventDefault();
   uploadData();
   toggleConfigAndViewDataButton(false);
});

buttonAlertCloseUploadData.addEventListener('click', () => {
   alertSuccessUploadData.style.display = 'none';
});

buttonAlertCloseClearData.addEventListener('click', () => {
   alertSuccessClearData.style.display = 'none';
});
