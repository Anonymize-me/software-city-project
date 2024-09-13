# Presentation

# ToC
- Project / Papers
- Literature Review Findings
- Tool Features Demonstration
- Analysis Demonstration
- Open Discussion



## Project / Papers
- Software city + Biometric data (Thierry + Jonas)
- Software city + Github pipeline (Amine + Jonas)
- 
- [Status of the project for Thierry](https://github.com/jonaslanzlinger/software-city-project/tree/v2.0.0)
- [Status of the Git extension](https://github.com/jonaslanzlinger/software-city-project)
- [Status of the old project, including all previous approaches to software city](https://github.com/jonaslanzlinger/software-city-project/tree/js-implementation_v1.0.0)



## Literature Review Findings
Short version (conclusion):
* Some prototypes are to be found in the literature.
  * They mostly specialize in one aspect of the visualization, e.g. packing algorithms for the 
    buildings, coloring of buildings, timeline aspect, interactivity, communication flows between components, etc.
  * VR capabilities in software cities
  * The most well-rounded prototype appears to be CodeCity by Richard Wettel. Is already about 15 years old. 
    Started off with a static code city -> then added also a timeline
* What we do new?
  * We combine the software city metaphor with biometric data.
  * We combine the software city metaphor with the Github pipeline.
  * We introduce a way to visualize any type of data, not just predefined data like biometric data or 
    static code metrics
  * We refine a time dimension (windowing) to the software city visualization.
  * We provide ways how to customize the tool easily:
    * aggregation functions (how the city should be computed)
    * customized metric calculation logic
  * We provide a web application for the visualization.
    * Really easy to clone and run locally (had lots of issues with the other prototypes)

Provide business value (see analysis)



## Tool Features Demonstration
Show the tool in action:
- eye-tracking
- github-repo


## Analysis Demonstration

See analysis: [summer-extension-week-8.md](weekly-reports%2Fsummer-extension-week-8.md)

- Bird-eye view
- God classes
- Complex classes

Let's have a look at complex classes:


### Complex classes

* finding classes that are unnecessarily complex, hard to understand
* CK Metrics Suite (CBO, DIT, LCOM*, NOC, RFC, WMC)

* Single metrics alone -> misleading (e.g. utility classes / single responsibility principle may be violated)
* -> use combination of metrics
* 3 metric combinations I used:
  * Identify classes with multiple high metrics
  * Identify classes with complex logic
  * Identify class with low cohesion



#### Identify god classes

Example Repository: JApiDocs (https://github.com/YeDaxia/JApiDocs)

* violating single responsibility principle
* god class not necessarily high LOC (helper classes)
* bring CBO and LOC into proportion
* size: LOC
* height: CBO
* colors: noMetric
* looking for high CBO, but first refactor those with high LOC aswell ("big fish")

* SpringControllerParser is a god class -> show code

- Amount of responsibilities: The class is doing too much - handling controller annotations, handling
  method annotations, parsing request parameters, handling responses, and even converting data types. In
  that sense, it is violating the single responsibility principle.
- Operations on various objects: The class is working with several different types of objects, and is
  performing many operations on them. These operations should be split up into multiple different
  controllers and parsers.
- Dependency on other classes: Regarding the separation of concern, the handling of spring annotations
  should be separated from the parsing logic and specific parts be delegated to dedicated classes.
- Conclusion: This class is a god class, and should be refactored.



#### Identify classes with multiple high metrics

* classes with high values in multiple metrics are likely "hot spots" in the code
* -> refactoring
* size: CBO
* height: RFC
* color-hue: WMC
* if too complex its displayed BIG, TALL, and/or in RED COLOR
* catch "big fish" first

Example Repository: EventBus (https://github.com/greenrobot/EventBus)

* EventBusAnnotationProcessor is very complex -> show code
* high cyclomatic complexity, nested if-else statements, loops
* violation of single responsibility principle (handling annotations, creating and writing to files, generating code, extensive error handling)
* should be refactored


From here, tweak a bit the parameters, and show the next example maybe...



#### Identify classes with complex logic

Example Repository: Restsuite (https://github.com/supanadit/restsuite)

* show RFC and WMC metrics here to identify complex classes

* go to commit 51 and 52: size of SocketIoPanel increased -> show that in the code (utilizing the timeline)

* go to end of timeline: 3 big classes -> show that in the code (utilizing the timeline) (UrlParser)


#### Limitations

* component renaming problem
* payload between services
* performance
* quality of metrices
