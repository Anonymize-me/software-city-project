import { recalculateGlobalNone } from "./recalculate-global-none";

const recalculateController = (
   cityMetaphor,
   cityElements,
   modelTreeBuilder,
   sliderBuilder,
   guiBuilder
) => {
   const aggregateFunction =
      document.getElementById("aggregate-function").value;

   switch (aggregateFunction) {
      case "globalNone":
         recalculateGlobalNone(
            cityMetaphor,
            cityElements,
            modelTreeBuilder,
            sliderBuilder,
            guiBuilder
         );
         break;
      default:
         console.log("No aggregate function selected.");
         break;
   }
};

export { recalculateController };
