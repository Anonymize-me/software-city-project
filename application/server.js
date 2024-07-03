import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/getRepositories', (req, res) => {
    res.send(gitHubRepositoryList);
});

app.post('/api/registerRepository', (req, res) => {
    const data = req.body;
    gitHubRepositoryList.push(data.repoName);
    res.send('Repository registered successfully');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

let gitHubRepositoryList = [];