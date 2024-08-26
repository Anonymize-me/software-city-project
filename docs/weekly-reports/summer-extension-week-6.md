# Summer Extension - Week 6 & 7

Here are the links to the individual branches of the project:
- [Status of the project for Thierry](https://github.com/jonaslanzlinger/software-city-project/tree/v2.0.0)
- [Status of the Git extension](https://github.com/jonaslanzlinger/software-city-project)
- [Status of the old project, including all previous approaches to software city](https://github.com/jonaslanzlinger/software-city-project/tree/js-implementation_v1.0.0)

The task for the past two weeks was to finish the implementations of the tool.
Since Thierry gave valuable input on the structure, design, and nomenclature of the project and 
its implementation (via showing me a UML diagram of his thoughts), I have been working extensively to make all adjustments to implement Thierry's
proposal. This work included the following tasks:
- Remove server capabilities from his part of the tool
- Distinction between "metaphor-models" and "visualization" in the code
- Implement the "metaphor-models" part of the tool: This part includes the classes and methods
that are responsible for creating a city metaphor abstraction. This abstraction is constructed, using the inputs of the user via the UI.
- Implement the "visualization" part of the tool: This part includes everything that is responsible for visualizing the city metaphor abstraction, using the Three.js 3D framework.
This visualization is displayed to the user via the UI. The general idea is that the visualization module can take any constructed city metaphor, and is able to construct the city.
In this part of the tool, I have made use of the "Director & Builder" design pattern.
- Furthermore, I have added/removed some functionalities, that were not necessary for the prototype that Thierry needs.
- Cleaned up the code base

Then, I have adapted the new project structure to the Git extension part, as this new structure makes maintaining and extending the code base much easier.
At this point, the computation of software metrics was limited to JavaScript repositories, took a really long time (mostly due to the need of transpiling the repositories in the needed JavaScript version first), 
and had the problem ob not being able to compute metrics for repositories in an asynchronous manner.
Therefore, we decided to switch to a different approach:
- Rewrite the backend server in Java, using Spring Boot to create a RESTful webservice.
- Split the backend service into multiple microservices, to make the code more maintainable and extendable.
Now, there are 4 different services:
  1. The frontend service (hosted via nginx), which is responsible for serving the UI
  2. The backend service, which is responsible for the communication with the frontend service, the metrics-computation-service, and the database.
  3. The database, which is responsible for storing the computed metrics.
  4. The metrics-computation-service, which is responsible for computing the metrics of a given repository.
- The analysis of the repositories is now done asynchronously, using a non-block job-queue (using the worker pattern).
![job-queue.png](..%2Fresources%2Fjob-queue.png)
- All services are implemented using hexagonal architecture.
- All services are containerized using Docker, and can be started using ```docker-compose up --build```
- Also, I have implemented additional features, that enhance the user experience using the tool. The most important new feature is the ability to reposition elements within the visualization via "alt + drag"

The implementation of the Git extension part is almost done. After the meeting with Amine, we have decided to move to the exploratory research phase this week. Before I start with this,
I want to fix some issues (like lagging, memory issues, chunked transmitting of metrics files, and some minor bugs) in the tool, containing the following tasks:
- only load metrics to frontend, when repository has been selected for analysis
- only load metrics into memory in backend service, when repository has been selected for analysis
- adjust y-pos of buildings, such that they are not overlapping with the planes
- fix experiment data type visualization (issue with field separator)
- fix color picker appearance
- when clicking on element in the model tree, draw indicator arrow over corresponding element in visualization
- check, if charts are displayed correctly
- check, if buildings are displayed correctly
- transmitting of metrics from metrics-computation-service to backend via chunks to avoid request payload size limit

After these tasks, I will start answering the following questions, using the tool:
- What questions can we answer with this tool?
- What tool features allow us to answer these questions?
- What are answers for these questions on the example of a given repository?
- Note: The answers need to bring some business value. Organize the questions and answers into themes.