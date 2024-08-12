export default class PlaneDescriptor {
   constructor() {
      this.groupingPath = '';
      this.participant = 0;
      this.taskId = 0;
      this.descriptorData = [];
      this.parentDescriptor = null;
      this.childDescriptors = [];
   }

   setGroupingPath(groupingPath) {
      this.groupingPath = groupingPath;
   }

   setParentDescriptor(parentDescriptor) {
      this.parentDescriptor = parentDescriptor;
   }

   addChildDescriptor(childDescriptor) {
      this.childDescriptors.push(childDescriptor);
   }
}
