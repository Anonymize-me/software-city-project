import { Commit } from "./commit.js";
import fs from "fs";

/**
 * @method writeCommitMetricsToFile - Writes all metric lines to a csv-file
 *
 * @param {Commit} commit - The commit object
 * @param {string} fileName - The name of the file to write to
 */
const writeCommitMetricsToFile = (commit, fileName) => {
   const fileExists = fs.existsSync(fileName);

   if (!fileExists) {
      fs.writeFileSync(fileName, commit.getPrintableHeaderLine());
   }

   for (const metricLine of commit.metricLines) {
      fs.appendFileSync(fileName, metricLine.getPrintableMetricLine());
   }
};

export { writeCommitMetricsToFile };
