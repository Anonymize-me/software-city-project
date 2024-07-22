/**
 * @class Commit
 * @classdesc Class representing a commit
 *
 * @property {string} commitHash - The commit hash
 * @property {string} timestamp - The timestamp of the commit
 * @property {Array} propertyNames - The property names for the commit
 * @property {Array} metricLines - The metric lines for the commit
 */
class Commit {
   #commitHash;
   #timestamp;
   #propertyNames;
   #metricLines;

   constructor(commitHash, timestamp) {
      this.#commitHash = commitHash;
      this.#timestamp = timestamp;
      this.#propertyNames = [];
      this.#metricLines = [];
   }

   get commitHash() {
      return this.#commitHash;
   }

   get timestamp() {
      return this.#timestamp;
   }

   get propertyNames() {
      return this.#propertyNames;
   }

   get metricLines() {
      return this.#metricLines;
   }

   addPropertyName(propertyName) {
      this.#propertyNames.push(propertyName);
   }

   addMetricLine(metricLine) {
      this.#metricLines.push(metricLine);
   }

   getPrintableHeaderLine() {
      return `${["commitHash", "timestamp", ...this.#propertyNames].join(",")}\n`;
   }

   toString() {
      return `Commit[commitHash=${this.#commitHash}, timestamp=${this.#timestamp}, properties=${this.#propertyNames}, metrics=${this.#metricLines}]`;
   }
}

export { Commit };
