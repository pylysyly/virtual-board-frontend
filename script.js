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
  note.className = 'task-card draggable-note';
  note.innerHTML = `
    <div class="note-banner d-flex justify-content-between align-items-center">
      <input type="text" class="banner-input" value="Note">
      <button class="btn btn-sm customrmv-btn remove-note">&times;</button>
    </div>
    <textarea class="note-textarea" placeholder="Write here..."></textarea>
  `;
  note.style.position = 'absolute';
  note.style.left = '20px';
  note.style.top = '20px';
  document.getElementById('notes-container').appendChild(note);

  // Remove note on button click
  note.querySelector('.remove-note').onclick = function() {
    note.remove();
  };

  makeDraggable(note);
});

function makeDraggable(elem) {
  let offsetX, offsetY, isDragging = false;

  elem.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('remove-note') || e.target.classList.contains('note-textarea')) return;
    isDragging = true;
    const container = document.getElementById('notes-container');
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left - elem.offsetLeft;
    offsetY = e.clientY - rect.top - elem.offsetTop;
    elem.style.zIndex = Date.now();
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    const container = document.getElementById('notes-container');
    const rect = container.getBoundingClientRect();
    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top - offsetY;
    x = Math.max(0, Math.min(x, container.offsetWidth - elem.offsetWidth));
    y = Math.max(0, Math.min(y, container.offsetHeight - elem.offsetHeight));
    elem.style.left = x + 'px';
    elem.style.top = y + 'px';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    document.body.style.userSelect = '';
  });
}
