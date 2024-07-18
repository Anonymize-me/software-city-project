# Summer Extension - Week 2

This week I have met with Thierry to discuss the further development/refactoring/documentation for the software city tool, in order for him to use the tool in a nice way. Because the tool still had a lot of bugs, I invested quite some time to smoothen everything out. Here is a detailed view of what I have implemented:

- [x]: Fixed bug: When uploading new data, the old data now gets completely erased from the data store.
- [x]: Added empty options in the dropdown lists for "participant", "taskId", and "timestamp". Now, if nothing is selected, all data records are considered in the visualization.
- [x]: If the empty option has been selected, don't show "participant" and "taskId" in the "Metaphors" view.
- [x]: Fixed bug: If the uploaded file contains a blank line at the end of the file, the tool doesn't crash anymore.
- [x]: Fixed bug: When inside the visualization view the user clicks on "View Data", the visualization model gets removed.
- [x]: Overworked dat.gui component: Now, instead of only adjusting the color of a building, the user can adjust the saturation level for the buildings color. This is done via a threshold and a saturation level as a slider. When a given building is below the selected threshold, the selected saturation level is applied. Otherwise the saturation level is set to 1. Via a dropdown list in the dat.gui, the user can select which attribute should be taken into account for manifesting the saturation of the building.
- [x]: In the dat.gui, the lower and upper bounds of the sliders are not hardcoded anymore, rather retrieved dynamically, depending on the selection of the attribute from the dropdown list.
- [x]: In dat.gui the user doesn't need to click on "apply" anymore to see the changes. This is now happening while adjusting the settings adhoc.
- [x]: Overworked the way how colors work in the visualization. Now, the user not only is allowed to select a color, but rather he can select an attribute for hue, luminance, and saturation, which gives the user more control over the visualization.
- [x]: Renamed some GUI components.
- [x]: Removed aggregation function selection -> not needed for Thierry's use cases.
- [x]: Removed file data type "Java Source Code" -> not needed for Thierry's use cases.
- [x]: Removed metaphors "City Dimensions" and "City Spread"
- [x]: Overworked the data tables: They are built correctly now, before, when uploading multiple datasets, the tables threw errors, and didn't build properly. Now also the user can upload different datasets with different numbers of attributes, which led to errors beforehand.
- [x]: Fixed bug: When moving the "t0" slider after the "t1" slider, this resulted in a crash of the application. (Also the other way around).
- [x]: Overworked the info panel for a building. The charts now look much better, and don't bug out, if clicked on multiple consecutive buildings quickly.
- [x]: Fixed bug: When only 1 building is present in the visualization, the visualization still works.
- [x]: When no buildings are present in the visualization, the user gets informed about that via an alert message.
- [x]: A lot of refactoring and cleaning up code base.
- [x]: Removed server-full capabilities, as this is not needed for Thierry's use case.
- [x]: Updated the instructions landing page of the tool with better descriptions of the tool's functionalities.

Furthermore, I have organized the code within the GitHub repository in a much better way:

- Code for Thierry's tool - includes only the relevant files: [Branch v1.0.0](https://github.com/jonaslanzlinger/software-city-project/tree/v1.0.0)
- Deployment for Thierry's tool: [Deployment](https://jonaslanzlinger.github.io/software-city-project/)
- Most recent code for the whole project, including summer extension code - this branch is constantly under development: [Branch main](https://github.com/jonaslanzlinger/software-city-project/tree/main)

At the beginning of the week I have been doing some literature research, looking for papers that write about how they calculate static software metrics. [This page](https://github.com/analysis-tools-dev/static-analysis) and [this page](https://owasp.org/www-community/Source_Code_Analysis_Tools) provide a nice overview over static code analysis tools. Unfortunately those tools don't quite achieve what we need. The most prevalent use case for those analysis tools is to identify code smells or security flaws. We instead, are interested in just simple source code metrics, like lines of code or number of methods. After browsing through some material, I find the following options the most suitable ways how to do it.

- Do it myself
- SonarQube: I connected my repository to SonarQube already, but this seems to not fulfill our use case.
- https://github.com/AlDanial/cloc Very basic.
- https://git-quick-stats.sh/ Something like this tool would be nice, where we can access a github repository an get simple statistics on each individual commit. I tried that locally to potentially see how it works.

The upcoming days, I will try to come up with a nice way how to do it. Reading repositories with our tool already works. Also identifying the individual commits on the repository works. If I manage to build .csv files in the format that is needed for the tool, then this would be really cool. To test and play around with possible alternatives, I have created a dummy repository with a couple of commits on GitHub.
