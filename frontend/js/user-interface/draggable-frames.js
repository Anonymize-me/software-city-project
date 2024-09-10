const frameModelTree = document.getElementById('frame-model-tree');
const frameInfo = document.getElementById('frame-info');

let draggingElement = null;
let isDragging = false;
let offsetX, offsetY;

const draggingMouseDownEventListener = (draggable) => {
   draggable.addEventListener('mousedown', (e) => {
      const rect = draggable.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      if (offsetX > rect.width - 17 && offsetY > rect.height - 17) return;
      draggingElement = draggable;
      isDragging = true;
      document.addEventListener('mousemove', dragging);
      document.addEventListener('mouseup', stopDragElement);
   });
}

const dragging = (e) => {
   if (isDragging) {
      draggingElement.style.left = e.clientX - offsetX + 'px';
      draggingElement.style.top = e.clientY - offsetY + 'px';
   }
};

const stopDragElement = () => {
   draggingElement = null;
   isDragging = false;
   document.removeEventListener('mousemove', dragging);
   document.removeEventListener('mouseup', stopDragElement);
};

draggingMouseDownEventListener(frameModelTree);
draggingMouseDownEventListener(frameInfo);