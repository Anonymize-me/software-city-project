async function getRepositoryData(repoName) {

    const apiUrl = `https://api.github.com/repos/${repoName}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching repository: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('Error:', error);
    }
}

async function getStaticMetricFiles(repoName) {
    const apiUrl = `https://api.github.com/repos/${repoName}/contents/metrics/static`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching folder contents: ${response.statusText}`);
        }

        const data = await response.json();

        const fileNames = data.map(item => `metrics/static/${item.name}`);
        return fileNames;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function getBioMetricsFiles(repoName) {
    const apiUrl = `https://api.github.com/repos/${repoName}/contents/metrics/bio-metrics`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching folder contents: ${response.statusText}`);
        }

        const data = await response.json();

        const fileNames = data.map(item => `metrics/bio-metrics/${item.name}`);
        return fileNames;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function getFileContent(repoName, filePath) {
    const apiUrl = `https://api.github.com/repos/${repoName}/contents/${filePath}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching file content: ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the content is base64 encoded
        if (data.encoding === 'base64') {
            const decodedContent = atob(data.content.replace(/\n/g, ''));
            console.log('File Content:', decodedContent);
        } else {
            console.log('File Content:', data.content);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

export { getRepositoryData, getStaticMetricFiles, getBioMetricsFiles, getFileContent };