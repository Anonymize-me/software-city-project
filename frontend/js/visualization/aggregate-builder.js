export default class AggregateBuilder {
   constructor() {
      this.type = "AggregateBuilder";
      this.aggregateFunction = document.getElementById("aggregate-function");
   }

   build() {
      this.aggregateFunction.style.display = "block";
   }

   destroy() {
      this.aggregateFunction.style.display = "none";
   }
}
