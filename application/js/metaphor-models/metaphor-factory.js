import GroupingPathMetaphor from './grouping-path-metaphor';
import TimestampMetaphor from './timestamp-metaphor';
import DimensionMetaphor from './dimension-metaphor';
import HeightMetaphor from './height-metaphor';
import ColorHueMetaphor from './color-hue-metaphor';
import ColorSaturationMetaphor from './color-saturation-metaphor';
import ColorLightnessMetaphor from './color-lightness-metaphor';

export default class MetaphorFactory {
   constructor() {}

   createMetaphor(metaphorName, selectionName) {
      switch (metaphorName) {
         case 'groupingPath':
            return new GroupingPathMetaphor(selectionName);
         case 'timestamp':
            return new TimestampMetaphor(selectionName);
         case 'dimension':
            return new DimensionMetaphor(selectionName);
         case 'height':
            return new HeightMetaphor(selectionName);
         case 'hue':
            return new ColorHueMetaphor(selectionName);
         case 'saturation':
            return new ColorSaturationMetaphor(selectionName);
         case 'lightness':
            return new ColorLightnessMetaphor(selectionName);
         default:
            return null;
      }
   }
}
