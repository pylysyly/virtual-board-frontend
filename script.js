
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