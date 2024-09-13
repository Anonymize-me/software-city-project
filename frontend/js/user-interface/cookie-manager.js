import { v4 as uuidv4 } from 'uuid';
import { getAttributeNames } from '../data';

const updateConfig = (config) => {
   const date = new Date();
   date.setTime(date.getTime() + 1 * 1 * 60 * 60 * 1000);
   const expires = `expires=${date.toUTCString()}`;
   let attributeNames = getAttributeNames();
   const data = {
      attributeNames,
      config,
   };
   const uuid = uuidv4();
   let name = `config-${uuid}`;
   let oldConfig = getConfig();
   if (oldConfig.length > 0) {
      name = oldConfig[0].split('=')[0];
   }
   document.cookie = `${name}=${JSON.stringify(data)};path=/;${expires}`;
};

const getConfig = () => {
   const cookies = document.cookie.split('; ');
   const configs = cookies.filter((cookie) => cookie.startsWith('config-'));
   configs.forEach((entry) => {
      const entryNamesSorted = JSON.parse(entry.split('=')[1])
         .attributeNames.sort()
         .toString();
      const attributeNamesSorted = [...getAttributeNames()].sort().toString();
      if (entryNamesSorted === attributeNamesSorted) {
         return entry;
      }
   });
   return configs;
};

const updateMapping = (mapping) => {
   const date = new Date();
   date.setTime(date.getTime() + 1 * 1 * 60 * 60 * 1000);
   const expires = `expires=${date.toUTCString()}`;
   let attributeNames = getAttributeNames();
   const data = {
      attributeNames,
      mapping,
   };
   const uuid = uuidv4();
   let name = `mapping-${uuid}`;
   let oldMapping = getMapping();
   if (oldMapping.length > 0) {
      name = oldMapping[0].split('=')[0];
   }
   document.cookie = `${name}=${JSON.stringify(data)};path=/;${expires}`;
};

const getMapping = () => {
   const cookies = document.cookie.split('; ');
   const mappings = cookies.filter((cookie) => cookie.startsWith('mapping-'));
   mappings.forEach((entry) => {
      const entryNamesSorted = JSON.parse(entry.split('=')[1])
         .attributeNames.sort()
         .toString();
      const attributeNamesSorted = getAttributeNames().sort().toString();

      if (entryNamesSorted === attributeNamesSorted) {
         return entry;
      }
   });
   return mappings;
};

export { updateConfig, getConfig, updateMapping, getMapping };
