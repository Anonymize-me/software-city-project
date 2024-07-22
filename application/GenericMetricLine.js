/**
 * @class GenericMetricLine
 * @classdesc A class that represents a generic metric line
 *
 * @property {Commit} commit - The commit object
 * @property {Array} propertyValues - The values of the properties
 */
class GenericMetricLine {
  #commit;
  #propertyValues;

  constructor(commit) {
    this.#commit = commit;
    this.#propertyValues = [];
  }

  get commit() {
    return this.#commit;
  }

  get propertyValues() {
    return this.#propertyValues;
  }

  addProperty(value) {
    this.#propertyValues.push(value);
  }

  getPropertyValueByIndex(index) {
    return this.#propertyValues[index];
  }

  getPrintableMetricLine() {
    return `${[this.#commit.getCommitHash(), this.#commit.getTimestamp(), ...this.#propertyValues].join(",")}\n`;
  }
}
