export default class BuildingDescriptor {
   constructor(buildingId) {
      this.buildingId = buildingId;
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

   setParticipant(participant) {
      this.participant = participant;
   }

   setTaskId(taskId) {
      this.taskId = taskId;
   }

   addDescriptorData(descriptorData) {
      this.descriptorData.push(descriptorData);
   }

   setParentDescriptor(parentDescriptor) {
      this.parentDescriptor = parentDescriptor;
   }

   addChildDescriptor(childDescriptor) {
      this.childDescriptors.push(childDescriptor);
   }
}
