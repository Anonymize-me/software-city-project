import {getOriginalData, getAttributeNames, clearData} from '../data.js';
import {showSuccessClearDataAlert} from "./alerts.js";
import {showViewData} from "./view-data.js";
import {showInstructions} from "./instructions.js";
import {
   enableButtonConfig,
   enableButtonMetaphors,
   enableButtonModelTree,
   enableButtonViewData
} from "./navbar.js";
import {objectArrayToCsv} from "../utils.js";

const buttonClearData = document.getElementById('button-clear-data');
const buttonDownloadData = document.getElementById('button-download-data');

buttonClearData.addEventListener("click", () => {
   clearData();
   showSuccessClearDataAlert();
   buildTable();
   enableButtonConfig(false);
   enableButtonViewData(false);
   enableButtonMetaphors(false);
   enableButtonModelTree(false);

   showViewData(false);
   showInstructions(true);
});

const clearTable = () => {
   if ($.fn.DataTable.isDataTable('#table-data')) {
      $('#table-data').DataTable().clear().destroy();
   }
   $('#table-data thead').empty();
   $('#table-data tbody').empty();
   buttonClearData.style.display = 'none';
   buttonDownloadData.style.display = 'none';
};

const buildTable = () => {
   let dataSet = getOriginalData().map((entry) => {
      let values = [];
      for (let key in entry) {
         values.push(entry[key]);
      }
      return values;
   });

   let columns = getAttributeNames().map((attribute) => {
      return { title: attribute };
   });

   if (dataSet.length > 0 && columns.length > 0) {
      clearTable();
      $('#table-data').DataTable({
         data: dataSet,
         columns: columns,
         destroy: true,
      });
   } else {
      clearTable();
   }

   if (dataSet.length > 0) {
      buttonClearData.style.display = 'block';
      buttonDownloadData.style.display = 'block';
   } else {
      buttonClearData.style.display = 'none';
      buttonDownloadData.style.display = 'none';
   }
};

buttonDownloadData.addEventListener("click", () => {
   const data = getOriginalData();
   const csvData = objectArrayToCsv(data);
   const blob = new Blob([csvData], { type: 'text/csv' });
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.setAttribute('hidden', '');
   a.setAttribute('href', url);
   a.setAttribute('download', 'metrics.csv');
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
});

export { buildTable };
