# Summer Extension - Week 4 & 5

The past two weeks, I have mainly worked on the following things:

-  I have extended the workflow for computing the per-commit software metrics, to compute various software metrics via a 3rd party library, including "lines of code", "complexity", "maintainability", "number of methods", "number of dependencies", etc. With this way of computing software metrics, the computation takes considerable amount of time, but the resulting csv-file can be downloaded and provided to the tool the next time. Also the computation for now only works for JavaScript repositories, because libraries that are able to compute software metrics for a wider range of languages are either cost-intensive, or simply don't exist. The possibility to easily expand the tool for additional programming languages is given.
-  Bug fixes in several areas of functionalities:
   -  Normalization of the buildings
   -  Chart graphics now also work for the static software metric visualization
   -  The GUI for the ThreeJS model now also works for the static software metric visualization
-  In discussion with Thierry, I have adapted the implementation of the tool to make use of the "Factory Pattern" and the "Builder and Director Pattern". Therefore, I have done extensive refactoring.

After the meeting with Amine on Monday, 12. August 2024, we have agreed on a explorative approach from now on. That means, in the first step, I will define a selection of github repositories that I want to analyze. In the second step, I try to come up with possible insights about the code quality of those repositories that I was able to derive from my software city tool. If I then come across difficulties, that are linked to the potential limitations of the tool, I am free to adjust the prototype. In the meantime, we have agreed on refactoring the new prototype in parallel such that it has the same base functionality as the prototype for Thierry. One potential point of interest is still the way, how the city gets constructed (i.e. a building stays at a given position within the city over some period of time).
