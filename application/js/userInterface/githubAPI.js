async function getRepositoryData(repoName) {
   const apiUrl = `https://api.github.com/repos/${repoName}`;

   try {
      const response = await fetch(apiUrl, {
         headers: {
            Accept: "application/vnd.github.v3+json",
         },
      });

      if (!response.ok) {
         throw new Error(`Error fetching repository: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
   } catch (error) {
      console.error("Error:", error);
   }
}

async function getStaticMetricFiles(repoName) {
   const apiUrl = `https://api.github.com/repos/${repoName}/contents/metrics/static`;

   try {
      const response = await fetch(apiUrl, {
         headers: {
            Accept: "application/vnd.github.v3+json",
         },
      });

      if (!response.ok) {
         throw new Error(
            `Error fetching folder contents: ${response.statusText}`
         );
      }

      const data = await response.json();

      const fileNames = data.map((item) => `metrics/static/${item.name}`);
      return fileNames;
   } catch (error) {
      console.error("Error:", error);
   }
}

async function getBioMetricsFiles(repoName) {
   const apiUrl = `https://api.github.com/repos/${repoName}/contents/metrics/bio-metrics`;

   try {
      const response = await fetch(apiUrl, {
         headers: {
            Accept: "application/vnd.github.v3+json",
         },
      });

      if (!response.ok) {
         throw new Error(
            `Error fetching folder contents: ${response.statusText}`
         );
      }

      const data = await response.json();

      const fileNames = data.map((item) => `metrics/bio-metrics/${item.name}`);
      return fileNames;
   } catch (error) {
      console.error("Error:", error);
   }
}

async function getFileContent(repoName, filePath) {
   const apiUrl = `https://api.github.com/repos/${repoName}/contents/${filePath}`;

   try {
      const response = await fetch(apiUrl, {
         headers: {
            Accept: "application/vnd.github.v3+json",
         },
      });

      if (!response.ok) {
         throw new Error(`Error fetching file content: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if the content is base64 encoded
      if (data.encoding === "base64") {
         const decodedContent = atob(data.content.replace(/\n/g, ""));
         console.log("File Content:", decodedContent);
      } else {
         console.log("File Content:", data.content);
      }
   } catch (error) {
      console.error("Error:", error);
   }
}

async function downloadRepo(repoName) {
   const apiUrl = "/api/calculateMetrics";
   const data = { repoName: repoName };

   try {
      document.getElementById("spinner-wrapper").style.display = "flex";

      const response = await fetch(apiUrl, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });

      if (!response.ok) {
         throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.text();

      // create an alert to ask, if the user wants to download the metrics file
      const downloadMetrics = confirm(
         "Do you want to download the computed metrics file?"
      );

      if (downloadMetrics) {
         const blob = new Blob([responseData], { type: "text/csv" });
         const blobUrl = URL.createObjectURL(blob);
         const hiddenDownloadLinkElement = document.createElement("a");
         hiddenDownloadLinkElement.href = blobUrl;
         hiddenDownloadLinkElement.download = "metrics-file.csv";
         document.body.appendChild(hiddenDownloadLinkElement);
         hiddenDownloadLinkElement.click();
         document.body.removeChild(hiddenDownloadLinkElement);
         URL.revokeObjectURL(blobUrl);
      }

      return responseData;
   } catch (error) {
      console.error("Error:", error);
   } finally {
      document.getElementById("spinner-wrapper").style.display = "none";
   }
}

export {
   getRepositoryData,
   getStaticMetricFiles,
   getBioMetricsFiles,
   getFileContent,
   downloadRepo,
};
