import { getOriginalData, getAttributeNames } from "../data.js";

const buttonClearData = document.getElementById("button-clear-data");

const clearTable = () => {
   if ($.fn.DataTable.isDataTable('#table-data')) {
      $('#table-data').DataTable().clear().destroy();
   }
   $('#table-data thead').empty();
   $('#table-data tbody').empty();
   buttonClearData.style.display = "none";
}

const buildTable = () => {

   let dataSet = getOriginalData().map(entry => {
      let values = [];
      for (let key in entry) {
         values.push(entry[key]);
      }
      return values;
   });

   let columns = getAttributeNames().map(attribute => {
      return { title: attribute };
   });

   if (dataSet.length > 0 && columns.length > 0) {
      clearTable();
      $('#table-data').DataTable({
         data: dataSet,
         columns: columns,
         destroy: true
      });
   } else {
      clearTable();
   }

   if (dataSet.length > 0) {
      buttonClearData.style.display = "block";
   } else {
      buttonClearData.style.display = "none";
   }
}

export { buildTable }