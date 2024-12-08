let tasks = [];

const taskList = document.getElementById('task-list');
const saveBtn = document.getElementById('save-btn');
const restoreBtn = document.getElementById('restore-btn');
const addBtn = document.getElementById('add-btn');

function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [
            { text: 'Learn Electron', completed: true },
            { text: 'Learn AG Grid', completed: false }
        ];
        saveToLocalStorage();
    }
    renderTasks();
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        
        const taskCell = document.createElement('td');
        taskCell.textContent = task.text;
        
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
        row.appendChild(completedCell);
        row.appendChild(removeCell);
        taskList.appendChild(row);
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
                        <input type="text" id="newTaskInput" class="form-control" placeholder="Enter task">
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

    const modal = document.getElementById('addTaskModal');
    const input = document.getElementById('newTaskInput');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    input.focus();

    cancelBtn.onclick = function() {
        document.body.removeChild(modalContainer);
    };

    confirmBtn.onclick = function() {
        const taskText = input.value.trim();
        if (taskText) {
            tasks.push({
                text: taskText,
                completed: false
            });
            saveToLocalStorage();
            renderTasks();
        }
        document.body.removeChild(modalContainer);
    };

    input.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            confirmBtn.click();
        }
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveToLocalStorage();
    renderTasks();
}

function removeTask(index) {
    tasks.splice(index, 1);
    saveToLocalStorage();
    renderTasks();
}

function saveTasks() {
    let textContent = 'TO-DO LIST\n\n';
    tasks.forEach((task, index) => {
        textContent += `${index + 1}. [${task.completed ? 'X' : ' '}] ${task.text}\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain' });
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = window.URL.createObjectURL(blob);
    a.download = 'todo-list.txt';
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}

function restoreTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const contents = event.target.result;
            const lines = contents.split('\n').slice(2); 
            
            tasks = lines
                .filter(line => line.trim()) 
                .map(line => {
                    const matched = line.match(/^\d+\. \[(X| )\] (.+)$/);
                    if (matched) {
                        return {
                            completed: matched[1] === 'X',
                            text: matched[2]
                        };
                    }
                    return null;
                })
                .filter(task => task !== null);
            
            saveToLocalStorage();
            renderTasks();
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

addBtn.addEventListener('click', addTask);
saveBtn.addEventListener('click', saveTasks);
restoreBtn.addEventListener('click', restoreTasks);

loadFromLocalStorage();