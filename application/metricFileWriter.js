import { Commit } from "./Commit.js";
import fs from "fs";

/**
 * @method writeCommitMetricsToFile - Writes all metric lines to a csv-file
 *
 * @param {Commit} commit - The commit object
 * @param {string} fileName - The name of the file to write to
 */
const writeCommitMetricsToFile = (commit, fileName) => {
  const fileExists = fs.existsSync(fileName);
  const fileStream = fs.createWriteStream(fileName, { flags: "a" });

  if (!fileExists) {
    fileStream.write(commit.getPrintableHeaderLine());
  }

  for (const metricLine of commit.getMetricLines()) {
    fileStream.write(metricLine.getPrintableMetricLine());
  }

  fileStream.end();

  console.log(`Metrics written to file: ${fileName}`);
};
