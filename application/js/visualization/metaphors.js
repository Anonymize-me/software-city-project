import { getMetaphorSelection } from "../data";
import { getMinValueByAttribute, getMaxValueByAttribute } from "../utils";

/**
 * Method that applies metaphors to the visualization
 *
 * @param {*} listTreeOfBuildings - A list with all TreeOfBuildings (1 except for java-source-code type)
 * @param {*} listModelTrees - A list with all ModelTrees
 */
const applyMetaphors = (listTreeOfBuildings, listModelTrees) => {
   const metaphorSelection = getMetaphorSelection();

   // Iterate through all treesOfBuildings and apply the metaphors: Color(Hue), Color(Luminance)
   listTreeOfBuildings.forEach((treeOfBuildings) => {
      // Color(Hue)
      const minHueValue = getMinValueByAttribute(
         metaphorSelection.hue,
         treeOfBuildings.list
      );
      const maxHueValue = getMaxValueByAttribute(
         metaphorSelection.hue,
         treeOfBuildings.list
      );

      // Color(Luminance)
      const minLuminanceValue = getMinValueByAttribute(
         metaphorSelection.luminance,
         treeOfBuildings.list
      );
      const maxLuminanceValue = getMaxValueByAttribute(
         metaphorSelection.luminance,
         treeOfBuildings.list
      );

      // set base color depending on the metaphor values within those min and max values
      treeOfBuildings.list.forEach((building) => {
         // Color(Hue)
         const hueValue = building.buildingData[0][metaphorSelection.hue];
         const hue = (hueValue - minHueValue) / (maxHueValue - minHueValue);

         // Color(Luminance)
         const luminanceValue =
            building.buildingData[0][metaphorSelection.luminance];
         const luminance =
            (luminanceValue - minLuminanceValue) /
            (maxLuminanceValue - minLuminanceValue);

         // set the color
         const ratio = 1;
         building.setColorHue(hue, ratio);
         // building.setColorSaturation(saturation, ratio);
         building.setColorLuminance(luminance, ratio);
      });
   });
};

export { applyMetaphors };
