# Summer Extension - Week 1
This week I have met with Amine to discuss the rough roadmap for the upcoming summer project. I summarized the technical requirements for the projects' implementation in the following document. The focument contains a project description, the idea of the workflow between GitHub and our software city tool, the requirements grouped per functionality, and the planned roadmap for the project:
* [Software_City_Requirements](../Software_City_Requirements.pdf)

## Implementation
For the first iteration, I have extended the software city tool to a serverful application with "express". Furthermore, I have worked on the communication between GitHub Actions and our software city tool. For now, if a user uploads [this](../../.github/workflows/workflow.yml) file into his repository, it is able to communicate with the tool. When someone then pushes commits on the main branch, GitHub Actions registers the repository in the software city tool. It is also already possible to fetch data of a repository into the software city tool.

Because the tool is now serverful, GitHub Pages is not working anymore, as it has no support for that. Therefore, I have deployed the tool on "Render". Because "Render" is free, when there is low activity, it shuts down the server, thus, it might take up to one minute until the page is reachable again:
* [Deployment](https://software-city-project.onrender.com)

## Literature Research
In discussion with Amine it makes most sense, to do a short literature research at the start of the project, to identify which components of the project idea have already been implemented by others. So far, I have started to look into related papers, but didn't find a lot of resources. The upcoming week will be dedicated to summarize findings and conclude the literature research.