# virtual-board-frontend
school project
color palette:
Background: #1C1C1C (soft black)
Primary Text: #F5E8D8 (warm beige)
Accent 1: #FF6F61 (muted coral)
Accent 2: #DAA520 (golden yellow)
Hover Effects: #FF4500 (burnt orange)


document.addEventListener('DOMContentLoaded', () => {
    const tasks = [
        { id: 1, title: 'Design new logo', status: 'todo', priority: 'high' },
        { id: 2, title: 'Prepare presentation', status: 'in-progress', priority: 'medium' },
        { id: 3, title: 'Update documentation', status: 'done', priority: 'low' },
    ];

    function createTaskCard(task) {
        const card = document.createElement('div');
        card.classList.add('task-card');
        card.setAttribute('draggable', true);
        card.setAttribute('data-id', task.id);
        card.innerHTML = `
                    <div class="task-priority priority-${task.priority}">${task.priority}</div>
                    <div>${task.title}</div>
                    <div class="task-actions">
                        <button class="btn btn-sm btn-outline-primary edit-task"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-outline-danger delete-task"><i class="fas fa-trash"></i></button>
                    </div>
                `;
        return card;
    }

    function renderTasks() {
        document.querySelectorAll('.tasks').forEach(column => {
            column.innerHTML = '';
            const status = column.dataset.status;
            tasks.filter(task => task.status === status).forEach(task => {
                column.appendChild(createTaskCard(task));
            });
        });
    }

    renderTasks();

    document.querySelectorAll('.task-card').forEach(taskCard => {
        taskCard.addEventListener('dragstart', () => {
            taskCard.classList.add('dragging');
        });

        taskCard.addEventListener('dragend', () => {
            taskCard.classList.remove('dragging');
        });
    });

    document.querySelectorAll('.tasks').forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            column.appendChild(draggingTask);
        });

        column.addEventListener('drop', e => {
            const taskId = e.target.closest('.task-card').dataset.id;
            const newStatus = column.dataset.status;
            const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
            tasks[taskIndex].status = newStatus;
            renderTasks();
        });
    });

    document.querySelector('.add-task-form button').addEventListener('click', () => {
        const titleInput = document.querySelector('.add-task-form input');
        const prioritySelect = document.querySelector('.add-task-form select');
        const newTask = {
            id: tasks.length + 1,
            title: titleInput.value,
            status: 'todo',
            priority: prioritySelect.value
        };
        tasks.push(newTask);
        renderTasks();
        titleInput.value = '';
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.delete-task')) {
            const taskCard = e.target.closest('.task-card');
            const taskId = parseInt(taskCard.dataset.id);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            tasks.splice(taskIndex, 1);
            renderTasks();
        }
        if (e.target.closest('.edit-task')) {
            const taskCard = e.target.closest('.task-card');
            const taskId = parseInt(taskCard.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            const newTitle = prompt('Edit task title:', task.title);
            if (newTitle) {
                task.title = newTitle;
                renderTasks();
            }
        }
    });
});

