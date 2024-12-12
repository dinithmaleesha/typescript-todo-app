interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const appDiv = document.getElementById('app')!;
let tasks: Task[] = [];

// Fetch tasks from the server
async function fetchTasks() {
  const response = await fetch('http://localhost:3000/tasks');
  tasks = await response.json();
  renderTasks();
}

// Render tasks in the UI
function renderTasks() {
  appDiv.innerHTML = `
      <input id="taskInput" placeholder="Add a task" />
      <button id="addTask">Add</button>
      <ul>
          ${tasks
              .map(
                  (task) => `
              <li>
                  <input type="checkbox" ${task.completed ? 'checked' : ''} />
                  ${task.title}
              </li>
          `
              )
              .join('')}
      </ul>
  `;

  document.getElementById('addTask')!.addEventListener('click', addTask);
}

// Add a new task to the server
async function addTask() {
  const input = document.getElementById('taskInput') as HTMLInputElement;
  if (input.value) {
      const newTask = { title: input.value, completed: false };
      const response = await fetch('http://localhost:3000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
      });
      const addedTask = await response.json();
      tasks.push(addedTask);
      input.value = '';
      renderTasks();
  }
}

fetchTasks();
