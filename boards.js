apiUrl = 'https://viritual-board-colab.onrender.com/';

let noteOffset = 0;

async function fetchBoards() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${apiUrl}boards`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch boards');
        }
        const boards = await response.json();
        return boards;
    } catch (error) {
        console.error('Error fetching boards:', error);
        return [];
    }
}

async function populateBoardSelector() {
    const boardSelector = document.getElementById('boardSelector');
    if (!boardSelector) {
        console.error('Board selector element not found');
        return;
    }

    try {
        const boards = await fetchBoards();

        boardSelector.innerHTML = '';

        if (boards.length === 0) {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'No boards available';
            defaultOption.disabled = true;
            boardSelector.appendChild(defaultOption);
            return;
        }

        boards.forEach(board => {
            const option = document.createElement('option');
            option.value = board.id || board._id;
            option.textContent = board.name || board.title || `Board ${board.id}`;
            boardSelector.appendChild(option);
        });

        if (boards.length > 0) {
            boardSelector.selectedIndex = 0;
        }

    } catch (error) {
        console.error('Error populating board selector:', error);
        boardSelector.innerHTML = '<option disabled>Error loading boards</option>';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    populateBoardSelector();
});

document.addEventListener('DOMContentLoaded', function () {
    const boardSelector = document.getElementById('boardSelector');
    if (boardSelector) {
        boardSelector.addEventListener('change', function () {
            const selectedBoardId = this.value;
            console.log('Selected board ID:', selectedBoardId);
            loadNotesForBoard(selectedBoardId);
        });
    }
});

async function loadNotesForBoard(boardId) {
    const token = localStorage.getItem('authToken');
    console.log(`Loading notes for board ID: ${boardId}`);
    try {
        const response = await fetch(`${apiUrl}boards/${boardId}/cards`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch notes for board');
        }
        const notes = await response.json();
        console.log('Fetched notes:', notes);
        displayNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

function displayNotes(notes) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) {
        console.error('Notes container element not found');
        return;
    }
    notesContainer.innerHTML = '';

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card draggable-note';
        noteElement.setAttribute('data-note-id', note.id || note._id); // Store note ID for operations
        noteElement.innerHTML = `
            <div class="note-banner d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <input type="text" class="banner-input" value="${note.title || note.name || 'Note'}">
                    <div class="color-btns ml-2 d-flex align-items-center">
                        <button class="color-btn color-yellow" data-color="#DAA520" title="Yellow"></button>
                        <button class="color-btn color-red" data-color="#FF6F61" title="Red"></button>
                        <button class="color-btn color-blue" data-color="#3A8DFF" title="Blue"></button>
                        <button class="color-btn color-green" data-color="#3CB371" title="Green"></button>
                        <button class="customrmv-btn remove-note ml-0">&times;</button>
                    </div>
                </div>
            </div>
            <textarea class="note-textarea" placeholder="Write here...">${note.content || note.text || ''}</textarea>
        `;

        const offset = noteOffset * 30; 
        noteElement.style.left = (note.positionX || note.posx || offset) + 'px';
        noteElement.style.top = (note.positionY || note.posY || offset) + 'px';
        noteOffset++;

        if (note.color) {
            const banner = noteElement.querySelector('.note-banner');
            banner.style.backgroundColor = note.color;
        }

        notesContainer.appendChild(noteElement);

        setupNoteEventListeners(noteElement);
    });
}

function setupNoteEventListeners(noteElement) {
    const noteId = noteElement.getAttribute('data-note-id');
    const boardSelector = document.getElementById('boardSelector');

    const removeBtn = noteElement.querySelector('.remove-note');
    if (removeBtn) {
        removeBtn.onclick = async function () {
            const success = await deleteNote(noteId);
            if (success) {
                noteElement.remove();
            } else {
                alert('Failed to delete note');
            }
        };
    }

    const banner = noteElement.querySelector('.note-banner');
    noteElement.querySelectorAll('.color-btn').forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
            e.stopPropagation();
            const newColor = btn.getAttribute('data-color');
            banner.style.backgroundColor = newColor;

            if (noteId && boardSelector.value) {
                const updatedData = {
                    color: newColor
                };
                await updateNote(boardSelector.value, noteId, updatedData);
            }
        });
    });

    const titleInput = noteElement.querySelector('.banner-input');
    if (titleInput) {
        titleInput.addEventListener('blur', async function () {
            const newTitle = this.value.trim();
            if (noteId && boardSelector.value && newTitle) {
                const updatedData = {
                    title: newTitle
                };
                await updateNote(boardSelector.value, noteId, updatedData);
            }
        });

        titleInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });
    }

    const contentTextarea = noteElement.querySelector('.note-textarea');
    if (contentTextarea) {
        contentTextarea.addEventListener('blur', async function () {
            const newContent = this.value.trim();
            if (noteId && boardSelector.value) {
                const updatedData = {
                    content: newContent
                };
                await updateNote(boardSelector.value, noteId, updatedData);
            }
        });
    }

    if (typeof makeDraggable === 'function') {
        makeDraggable(noteElement);

        let dragEndTimeout;
        noteElement.addEventListener('mouseup', function () {
            clearTimeout(dragEndTimeout);
            dragEndTimeout = setTimeout(async () => {
                if (noteId && boardSelector.value) {
                    const rect = noteElement.getBoundingClientRect();
                    const containerRect = document.getElementById('notes-container').getBoundingClientRect();
                    const positionX = rect.left - containerRect.left;
                    const positionY = rect.top - containerRect.top;

                    const updatedData = {
                        positionX: Math.round(positionX),
                        positionY: Math.round(positionY)
                    };
                    await updateNote(boardSelector.value, noteId, updatedData);
                }
            }, 500);
        });
    }
}

async function createNote(boardId, noteData) {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${apiUrl}boards/${boardId}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(noteData),
        });
        if (!response.ok) {
            throw new Error('Failed to create note');
        }
        const newNote = await response.json();
        console.log('Created new note:', newNote);
        return newNote;
    } catch (error) {
        console.error('Error creating note:', error);
        return null;
    }
}

function addNoteToDisplay(note) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) {
        console.error('Notes container element not found');
        return;
    }

    const noteElement = document.createElement('div');
    noteElement.className = 'note-card draggable-note';
    noteElement.setAttribute('data-note-id', note.id || note._id);
    noteElement.innerHTML = `
        <div class="note-banner d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <input type="text" class="banner-input" value="${note.title || note.name || 'Note'}">
                <div class="color-btns ml-2 d-flex align-items-center">
                    <button class="color-btn color-yellow" data-color="#DAA520" title="Yellow"></button>
                    <button class="color-btn color-red" data-color="#FF6F61" title="Red"></button>
                    <button class="color-btn color-blue" data-color="#3A8DFF" title="Blue"></button>
                    <button class="color-btn color-green" data-color="#3CB371" title="Green"></button>
                    <button class="customrmv-btn remove-note ml-0">&times;</button>
                </div>
            </div>
        </div>
        <textarea class="note-textarea" placeholder="Write here...">${note.content || note.text || ''}</textarea>
    `;
    const offset = noteOffset * 10;
    noteElement.style.left = (note.positionX || note.posx || offset) + 'px';
    noteElement.style.top = (note.positionY || note.posY || offset) + 'px';
    noteOffset++;

    if (note.color) {
        const banner = noteElement.querySelector('.note-banner');
        banner.style.backgroundColor = note.color;
    }

    notesContainer.appendChild(noteElement);
    setupNoteEventListeners(noteElement);

    return noteElement;
}

document.getElementById('add-task-btn').addEventListener('click', async function () {
    const boardSelector = document.getElementById('boardSelector');
    const selectedBoardId = boardSelector.value;

    if (!selectedBoardId) {
        alert('Please select a board first');
        return;
    }

    const offset = noteOffset * 10;
    const newNoteData = {
        title: 'Note',
        content: '',
        color: '#DAA520',
        positionX: offset,
        positionY: offset,
    };
    noteOffset++;

    const newNote = await createNote(selectedBoardId, newNoteData);
    if (newNote) {
        addNoteToDisplay(newNote);
    }
});

async function updateNote(boardId, noteId, updatedData) {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${apiUrl}boards/cards/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error('Failed to update note');
        }
        const updatedNote = await response.json();
        console.log('Updated note:', updatedNote);
        return updatedNote;
    } catch (error) {
        console.error('Error updating note:', error);
        return null;
    }
}

window.makeDraggable = function(elem) {
  
}

async function deleteNote(noteId) {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${apiUrl}boards/cards/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to delete note - Status: ${response.status}`);
        }
        console.log('Deleted note with ID:', noteId);
        return true;
    } catch (error) {
        console.error('Error deleting note:', error);
        return false;
    }
}