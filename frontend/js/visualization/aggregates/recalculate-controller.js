import { recalculateGlobalNone } from "./recalculate-global-none";

/**
 * Recalculate the city metaphor based on the selected aggregate function.
 */

const recalculateController = (
   cityMetaphor,
   cityElements,
   modelTreeBuilder,
   sliderBuilder,
   guiBuilder,
   infoPanelBuilder
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
            guiBuilder,
            infoPanelBuilder
         );
         break;
      default:
         console.log("No aggregate function selected.");
         break;
   }
};

export { recalculateController };
