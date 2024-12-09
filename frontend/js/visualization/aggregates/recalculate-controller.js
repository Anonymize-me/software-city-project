import { recalculateGlobalNone } from "./recalculate-global-none.js";

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
      recalculateGlobalNone(
         cityMetaphor,
         cityElements,
         modelTreeBuilder,
         sliderBuilder,
         guiBuilder,
         infoPanelBuilder
      );
};

export { recalculateController };
