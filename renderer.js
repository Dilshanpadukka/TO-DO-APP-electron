let tasks = [];
let completedTasks = [];

const taskList = document.getElementById('task-list');
const completedTaskList = document.getElementById('completed-task-list');

const saveBtn = document.getElementById('save-btn');
const restoreBtn = document.getElementById('restore-btn');
const addBtn = document.getElementById('add-btn');

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
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.className = 'checkbox-wrapper';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));
        checkboxWrapper.appendChild(checkbox);
        completedCell.appendChild(checkboxWrapper);

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

function renderCompletedTasks() {
    completedTaskList.innerHTML = '';
    completedTasks.forEach(task => {
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
        completedTaskList.appendChild(row);
    });
}

function addTask() {
    const modalHtml = `
        <div class="modal" id="addTaskModal" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Task</h5>
                    </div>
                    <div class="modal-body">
                        <input type="text" id="newTaskInput" class="form-control mb-2" placeholder="Enter task">
                        <label>Start Date</label>
                        <input type="date" id="startDateInput" class="form-control mb-2">
                        <label>Start Time</label>
                        <input type="time" id="startTimeInput" class="form-control mb-2">
                        <label>End Date</label>
                        <input type="date" id="endDateInput" class="form-control mb-2">
                        <label>End Time</label>
                        <input type="time" id="endTimeInput" class="form-control">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmBtn">Add Task</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    const input = document.getElementById('newTaskInput');
    const startDateInput = document.getElementById('startDateInput');
    const startTimeInput = document.getElementById('startTimeInput');
    const endDateInput = document.getElementById('endDateInput');
    const endTimeInput = document.getElementById('endTimeInput');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    cancelBtn.onclick = () => document.body.removeChild(modalContainer);

    confirmBtn.onclick = () => {
        const taskText = input.value.trim();
        const startDate = startDateInput.value;
        const startTime = startTimeInput.value;
        const endDate = endDateInput.value;
        const endTime = endTimeInput.value;

        if (taskText && startDate && startTime && endDate && endTime) {
            tasks.push({
                text: taskText,
                start: `${startDate} ${startTime}`,
                end: `${endDate} ${endTime}`,
                completed: false
            });
            saveToLocalStorage();
            renderTasks();
            document.body.removeChild(modalContainer);
        }
    };
}

function toggleTask(index) {
    tasks[index].completed = true;
    const completedTask = tasks.splice(index, 1)[0];
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

function saveTasks() {
    const textContent = 'TO-DO LIST\n\n' +
        tasks.map((task, index) => `${index + 1}. ${task.text}`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'todo-list.txt';
    a.click();
}

function restoreTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = event => {
            const lines = event.target.result.split('\n');
            tasks = lines.map(line => ({ text: line, completed: false }));
            saveToLocalStorage();
            renderTasks();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}

addBtn.addEventListener('click', addTask);
saveBtn.addEventListener('click', saveTasks);
restoreBtn.addEventListener('click', restoreTasks);

loadFromLocalStorage();
