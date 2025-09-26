//add note
document.getElementById('add-task-btn').addEventListener('click', function () {
  const note = document.createElement('div');
  note.className = 'note-card draggable-note';
  note.innerHTML = `
    <div class="note-banner d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <input type="text" class="banner-input" value="Note">
        <div class="color-btns ml-2 d-flex align-items-center">
          <button class="color-btn color-yellow" data-color="#DAA520" title="Yellow"></button>
          <button class="color-btn color-red" data-color="#FF6F61" title="Red"></button>
          <button class="color-btn color-blue" data-color="#3A8DFF" title="Blue"></button>
          <button class="color-btn color-green" data-color="#3CB371" title="Green"></button>
          <button class="customrmv-btn remove-note ml-0">&times;</button>
        </div>
      </div>
    </div>
    <textarea class="note-textarea" placeholder="Write here..."></textarea>
  `;
  note.style.position = 'absolute';
  note.style.left = '20px';
  note.style.top = '20px';
  document.getElementById('notes-container').appendChild(note);

  // remove note
  note.querySelector('.remove-note').onclick = function () {
    note.remove();
  };

  // note header color change
  const banner = note.querySelector('.note-banner');
  note.querySelectorAll('.color-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      banner.style.backgroundColor = btn.getAttribute('data-color');
    });
  });
});

// Drag and Drop funktion

function makeDraggable(elem) {
  let offsetX, offsetY, isDragging = false;

  elem.addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('remove-note') || e.target.classList.contains('note-textarea')) return;
    isDragging = true;
    const container = document.getElementById('notes-container');
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left - elem.offsetLeft;
    offsetY = e.clientY - rect.top - elem.offsetTop;
    elem.style.zIndex = Date.now();
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function (e) {
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

  document.addEventListener('mouseup', function () {
    isDragging = false;
    document.body.style.userSelect = '';
  });

}