/**
 * @class Commit
 * @classdesc Class representing a commit
 *
 * @property {string} commitHash - The commit hash
 * @property {string} timestamp - The timestamp of the commit
 * @property {Array} metricLines - The metric lines for the commit
 */
class Commit {
  #commitHash;
  #timestamp;
  #metricLines;

  constructor(commitHash, timestamp) {
    this.#commitHash = commitHash;
    this.#timestamp = timestamp;
    this.#metricLines = [];
  }

  get commitHash() {
    return this.#commitHash;
  }

  get timestamp() {
    return this.#timestamp;
  }

  get metricLines() {
    return this.#metricLines;
  }

  addMetricLine(metricLine) {
    this.#metricLines.push(metricLine);
  }
}
