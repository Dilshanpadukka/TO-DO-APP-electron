let tasks = [];
let completedTasks = [];

const taskList = document.getElementById('task-list');
const completedTaskList = document.getElementById('completed-task-list');

const saveBtn = document.getElementById('save-btn');
const restoreBtn = document.getElementById('restore-btn');
const addBtn = document.getElementById('add-btn');
const clearBtn = document.getElementById('clear-btn');

let isClearMode = false;

function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompletedTasks = localStorage.getItem('completedTasks');

    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    completedTasks = savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [];
    renderTasks();
    renderCompletedTasks();
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        
        const taskCell = document.createElement('td');
        taskCell.textContent = task.text;

        const startCell = document.createElement('td');
        startCell.textContent = task.start;

        const endCell = document.createElement('td');
        endCell.textContent = task.end;

        const completedCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => completeTask(index));
        completedCell.appendChild(checkbox);

        const removeCell = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', () => removeTask(index));
        removeCell.appendChild(removeBtn);

        row.appendChild(taskCell);
        row.appendChild(startCell);
        row.appendChild(endCell);
        row.appendChild(completedCell);
        row.appendChild(removeCell);
        taskList.appendChild(row);
    });
}

function renderCompletedTasks(showCheckboxes = false) {
    completedTaskList.innerHTML = '';
    completedTasks.forEach((task, index) => {
        const row = document.createElement('tr');

        const taskCell = document.createElement('td');
        taskCell.textContent = task.text;

        const startCell = document.createElement('td');
        startCell.textContent = task.start;

        const endCell = document.createElement('td');
        endCell.textContent = task.end;

        row.appendChild(taskCell);
        row.appendChild(startCell);
        row.appendChild(endCell);

        if (showCheckboxes) {
            const checkboxCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'clear-checkbox';
            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);
        } else {
            const placeholderCell = document.createElement('td');
            placeholderCell.textContent = '-';
            row.appendChild(placeholderCell);
        }

        completedTaskList.appendChild(row);
    });
}

function addTask() {
    const taskText = prompt('Enter task:');
    const start = prompt('Enter start date and time:');
    const end = prompt('Enter end date and time:');

    if (taskText && start && end) {
        tasks.push({ text: taskText, start, end, completed: false });
        saveToLocalStorage();
        renderTasks();
    }
}

function completeTask(index) {
    const [completedTask] = tasks.splice(index, 1);
    completedTask.completed = true;
    completedTasks.push(completedTask);

    saveToLocalStorage();
    renderTasks();
    renderCompletedTasks();
}

function removeTask(index) {
    tasks.splice(index, 1);
    saveToLocalStorage();
    renderTasks();
}

function toggleClearMode() {
    isClearMode = !isClearMode;
    clearBtn.textContent = isClearMode ? 'Cancel' : 'Clear';

    if (isClearMode) {
        renderCompletedTasks(true);
    } else {
        renderCompletedTasks();
    }
}

function clearSelectedTasks() {
    const checkboxes = document.querySelectorAll('.clear-checkbox');
    const selectedTasks = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedTasks.push(index);
        }
    });

    completedTasks = completedTasks.filter((_, index) => !selectedTasks.includes(index));

    saveToLocalStorage();
    renderCompletedTasks();
    toggleClearMode();
}

clearBtn.addEventListener('click', () => {
    if (isClearMode) {
        clearSelectedTasks();
    } else {
        toggleClearMode();
    }
});

addBtn.addEventListener('click', addTask);
saveBtn.addEventListener('click', saveToLocalStorage);
restoreBtn.addEventListener('click', loadFromLocalStorage);

loadFromLocalStorage();
