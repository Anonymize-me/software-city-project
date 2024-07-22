/**
 * @class GenericMetricLine
 * @classdesc A class that represents a generic metric line
 *
 * @property {Array} propertyNames - The names of the properties
 * @property {Array} propertyValues - The values of the properties
 */
class GenericMetricLine {
  #propertyNames;
  #propertyValues;

  constructor() {
    this.#propertyNames = [];
    this.#propertyValues = [];
  }

  get propertyNames() {
    return this.#propertyNames;
  }

  get propertyValues() {
    return this.#propertyValues;
  }

  addProperty(name, value) {
    this.#propertyNames.push(name);
    this.#propertyValues.push(value);
  }

  getPropertyValueByName(propertyName) {
    const index = this.#propertyNames.indexOf(propertyName);
    return this.#propertyValues[index];
  }
}
