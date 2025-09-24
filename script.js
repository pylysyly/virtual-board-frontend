
let dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);
  this.classList.add('dragging');
}

function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (dragSrcEl !== this) {
    this.parentNode.removeChild(dragSrcEl);
    let dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin', dropHTML);
    let dropped = this.previousSibling;
    addDnDHandlers(dropped);
  }
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
}

document.getElementById('add-task-btn').addEventListener('click', function() {
  const note = document.createElement('div');
  note.className = 'task-card';
  note.setAttribute('draggable', 'true');
  note.innerHTML = `
    <textarea class="note-textarea" placeholder="Write here..."></textarea>
    <button class="btn btn-sm btn-danger remove-note" style="position:absolute;top:5px;right:5px;">&times;</button>
  `;
  note.style.position = 'relative';
  document.getElementById('notes-container').appendChild(note);

  // Remove note on button click
  note.querySelector('.remove-note').onclick = function() {
    note.remove();
  };

  addDnDHandlers(note);
});
