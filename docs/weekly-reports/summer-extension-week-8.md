# Summer Extension - Week 8

Here are the links to the individual branches of the project:
- [Status of the project for Thierry](https://github.com/jonaslanzlinger/software-city-project/tree/v2.0.0)
- [Status of the Git extension](https://github.com/jonaslanzlinger/software-city-project)
- [Status of the old project, including all previous approaches to software city](https://github.com/jonaslanzlinger/software-city-project/tree/js-implementation_v1.0.0)

This week, I have worked on the following tasks:
[x] only load metrics to frontend, when repository has been selected for analysis
[x] only load repository data, when github frame is open
[x] only load metrics into memory in backend service, when repository has been selected for analysis
[x] adjust y-pos of buildings, such that they are not overlapping with the planes
[x] fix experiment data type visualization (issue with field separator)
[x] fix color picker appearance
[x] when clicking on element in the model tree, draw indicator arrow over corresponding element in 
  visualization and highlight element in model tree
[x] when clicking on element in visualization, highlight corresponding element in model tree
[x] when clicking on element in visualization, jump to corresponding element in model tree
[x] fix hovering issue in model tree
[x] display commit hash somewhere
[x] insert download button for currently loaded data in the "View Data" tab 
[x] check, if charts are displayed correctly
[x] check, if buildings are displayed correctly
- transmitting of metrics from metrics-computation-service to backend via chunks to avoid request payload size limit
- still some issues with lag, if lots of data points in metrics file (maybe reduce clutter in charts)

After these tasks, I will start answering the following questions, using the tool:
- What questions can we answer with this tool?
- What tool features allow us to answer these questions?
- What are answers for these questions on the example of a given repository?
- Note: The answers need to bring some business value. Organize the questions and answers into themes.