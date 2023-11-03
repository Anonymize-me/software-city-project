### Week 2
In week 2 I focused on formulating my own personal requirements for an ideal visualization tool in the context of software structure and biometric data about that software.

___

### What I have done in this week’s iteration
* General decisions on project considerations, e.g. what static code analyzing tools should be used, etc.
* Defined my own requirements for the software city project
* Completed a first prototype of software city visualization tool

___

### General issues
I assume since the project name is about “Software Cities”, the task is about finding a way to visualize data in a software city format.

After talking to Thierry, I found out that we don’t want to only use Software Cities as a visualization technique for the project.
There are various different types of software visualization:
* Paper Documents: 2D, poor navigation, static
* White board: 2D, static
* The Desktop Display: High resolution but limited display area, 2D+ (for the most part).
* More real estate: Multiple displays, large displays
* Support for collaborative problem solving
* Utilize: 3D, 3D+, Virtual Reality, Augmented Reality (combine stereopsis with motion, immersive environments), stereo displays, multi-resolution displays, multi-type medium (e.g. laptop + VE).
* provide navigational controls

My question here would be: What visualizations do we really want? Only software city or also others? This question really determines the decision we should make on how to tackle the project.

As far as I understand, it really is up to myself. Therefore, I have decided to formulate my own requirements for the project.

___

### My own Requirements for the project
* We want to be able to visualize biometric data provided by the team. This data should be aggregated in such a way, that the data is available in an easy-to-parse format.
* We want to visualize various different software metrics and display them.
* Only one kind of visualization: Software City. But different kind of aggregation types:
  * 3D visualization of a software city
  * 2D visualization of a software city
  * select visualization parameters by metric or biometric data
  * relationship visualization between buildings (which are some metrics depending on the input data)
* Input data should be provided in a structured form (e.g. csv-file). This has to be given for source code metrics and biometric data.
* No need to be one workflow (specifically: 1 workflow - source code to source code analyzer. 1 workflow - raw data to visualizing tool).

___

### Considerations Visualizing tool:
Therefore I further was looking for different possibilities how to display software metrics as a software city.
* data import into C# scripting file, that gets interpreted by Unity and displayed as a software city.
* provide raw data to Python and model our own software city with the STL library (or others, there are plenty of 3D modelling libraries).
* use AFrame. With that solution we could also use VR to make the software city more immersive.
* use Sonargraph
* use CodeCity
* 
From my findings I would propose that we have 3 different viable options.

### Option 1 - Own visualiziing tool in Unity:
Pro:
* best option for visualization
* we can add our own software metrics
* customizable representations
* easy to handle and great learning curve
* immersive visualization via panable / movable camera view (maybe extend with VR)
* no license costs

Contra:
* time intensive to build
* uncertain if it is possible to let a 3rd party tool analyze a software project and export the metrics in a csv-file manner

### Option 2 - Visualize in Sonargraph:
Sonargraph (by Hello2morrow: https://www.hello2morrow.com/products/sonargraph)
Sonargraph is a software for software visualization in general. It is more about finding weaknesses in the design of the software structure.
We could use Sonargraph to display the software in various different kinds of visualization techniques. But the software city visualization module is not that great.
We are only capable of displaying 1 metric at a time, with different threshold values.
Furthermore Sonargraph is not free to use, my 14-days trial license expired a couple days ago.

Pro:
* quick results
* predefined software metrics are already being computed
* lots of different visualization types
* no 3rd party library needed to compute source code metrics

Contra:
* difficult to use / flat learning curve
* reoccuring license costs
* define own software metrics is a tedious task (for an example, see week-1)
* loading biometrics data will be difficult
* no visualization of multiple software metrics at once
* Visual models are not optimal

### Option 3 - Visualize in CodeCity:
CodeCity (by Richard Wetter: https://wettel.github.io/codecity.html)
The Mac version has been last updated in 2009. At least on my machine the software does not run.
CodeCity is a free-to-use software that let's the users visualize a softare project as a software city. This program is built using VisualWorks Smalltalk on top of the Moose framework. The handling of CodeCity is not much easier than Sonargraph but the visualization looks better. As far as I understand it, it's not possible to easily add own custom metrics to CodeCity. You need to select metrics for visualization from a predefined metric list.
Pro:
* Better visualization than Sonargraph

Contra:
* unfortunately, software doesn't run on my computer
* Supposedly it's not possible to easily add own custom metrics to CodeCity. You need to select metrics for visualization from a predefined metric list.

I dit not find any other tool that implements natively a visualization of a software city. 

I think if we want to stick to the visualization of software as a Software City we should really consider implementing our own tool that displays data as a Software city.
Visualization based on our own data, that is not analyzing the source code of a software, is easily done.
As a next step it needs to be evaluated how we can get other software metrics data, apart from the biometrics data.

___

### Considerations for static source code analytics
A next step for the project would be to find out how we can get the software source code metrics. Therefore I explored some alternatives other than Sonargraph, but I discovered two findings:
* There are static code analysis tools. Mainly they analyze the code regarding security issues, style convention and other frequently occuring bugs
* some of the tools are quite hard to use

___

### Prototype - Software City visualization tool
I have started implementing a prototype for a visualization tool. 
The prototype can be tested by running this app [software-city-prototype-week-2.app](software-city-prototype-week-2.app)
Here are the steps I have taken to accomplish the final prototype down below:
* created new Unity 3D project
* implemented a camera view:
  * user is able to pan the camera and look around
  * user is able to move the camera in the space
* Script: we can define data for visualization in the script: The script parses the data and creates for every entry a new building in the software city model. Here, in this file is the place where we define new metrics / dimensions.
* Build and deploy the Prototype in Unity
