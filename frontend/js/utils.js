import { getDirector } from "./data.js";

const objectArrayToCsv = (objArray) => {
   const array = [Object.keys(objArray[0])].concat(objArray);

   return array.map(it => {
      return Object.values(it).toString();
   }).join('\n');
}

const jsonToCsv = (jsonData) => {
   const keys = Object.keys(jsonData[0]);
   const csvRows = [keys.join(',')];

   jsonData.forEach(row => {
      const values = keys.map(key => {
         let value = row[key];
         if (key === 'file' && typeof value === 'string') {
            value = value.replace(/\.java$/, '').replace(/"/g, '');
         } else if (typeof value === 'string') {
            value = value.replace(/"/g, '');
         }
         return value;
      });
      csvRows.push(values.join(','));
   });
   return csvRows.join('\n');
}

const createCsvFile = (csvString, fileName = 'data.csv') => {
   const blob = new Blob([csvString], { type: 'text/csv' });
   return new File([blob], fileName, { type: 'text/csv' });
}

const rgbToHsl = (color) => {
   let r = color.r;
   let g = color.g;
   let b = color.b;

   (r /= 255), (g /= 255), (b /= 255);
   var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
   var h,
      s,
      l = (max + min) / 2;

   if (max == min) {
      h = s = 0;
   } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
         case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
         case g:
            h = (b - r) / d + 2;
            break;
         case b:
            h = (r - g) / d + 4;
            break;
      }
      h /= 6;
   }

   return { h, s, l };
};

const hexToRgb = (hex) => {
   hex = hex.replace(/^#/, "");

   // Parse the hex string
   const r = parseInt(hex.substring(0, 2), 16);
   const g = parseInt(hex.substring(2, 4), 16);
   const b = parseInt(hex.substring(4, 6), 16);

   return { r, g, b };
};

const hslToHex = (h, s, l) => {
   function hslToRgb(h, s, l) {
      let r, g, b;

      if (s === 0) {
         r = g = b = l;
      } else {
         const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
         };

         const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
         const p = 2 * l - q;
         r = hue2rgb(p, q, h + 1 / 3);
         g = hue2rgb(p, q, h);
         b = hue2rgb(p, q, h - 1 / 3);
      }

      return {
         r: Math.round(r * 255),
         g: Math.round(g * 255),
         b: Math.round(b * 255),
      };
   }

   function rgbToHex(r, g, b) {
      return (
         "#" +
         ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
            .toUpperCase()
      );
   }

   const { r, g, b } = hslToRgb(h, s, l);
   return rgbToHex(r, g, b);
};

const removeAllEventListeners = (element) => {
   const clone = element.cloneNode(true);
   element.parentNode.replaceChild(clone, element);
   return clone;
};

const removeElementAndChildrenWithListeners = (element) => {
   try {
      while (element.firstChild) {
         removeElementAndChildrenWithListeners(element.firstChild);
      }

      element = removeAllEventListeners(element);
      if (element.parentNode) {
         element.parentNode.removeChild(element);
      }
   } catch (error) {}
};

const destroyCity = () => {
   const director = getDirector();
   if (director) {
      director.destroyCity();
   }
};

export {
   objectArrayToCsv,
   jsonToCsv,
   createCsvFile,
   rgbToHsl,
   hexToRgb,
   hslToHex,
   destroyCity,
   removeElementAndChildrenWithListeners,
};
