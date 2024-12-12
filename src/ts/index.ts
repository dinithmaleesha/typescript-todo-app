import { ToDo, ToDoProps } from "./models/Todos"

const tasks: ToDoProps[] = []
const todoList = document.getElementById("todoList")!
const titleInput = document.getElementById("titleInput") as HTMLInputElement
const descInput = document.getElementById("descInput") as HTMLTextAreaElement
const formContainer = document.getElementById("formContainer")!
const addButton = document.getElementById("addButton")!
const saveTaskButton = document.getElementById("saveTask")!

document.addEventListener("DOMContentLoaded", async () => {
  const todos = await ToDo.loadAll()
  tasks.push(...todos)

  const todoTemplates = todos.map(createTodoTemplate)
  renderTemplates(todoTemplates, todoList)

  todoList.addEventListener("click", (e) => {
    const target = e.target as HTMLElement

    if (target.classList.contains("done") || target.classList.contains("undo")) {
      const parent = target.closest(".todo-item")
      const id = parent?.getAttribute("data-id")

      if (id) {
        markDone(id)
      }
    }

    if (target.classList.contains("delete")) {
      const parent = target.closest(".todo-item")
      const id = parent?.getAttribute("data-id")

      if (id) {
        deleteTask(id)
      }
    }
  })
})

function createTodoTemplate(task: ToDoProps): string {
  return `
    <div class="todo-item" data-id="${task.id}">
      <div class="todo-header">
        <h3>${task.title}</h3>
        <span class="status ${task.completed ? 'completed' : 'pending'}">
          ${task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>
      <p class="todo-description">${task.description}</p>
      <div class="actions">
        <button class="${task.completed ? 'undo' : 'done'}">
          ${task.completed ? 'Undo' : 'Done'}
        </button>
        <button class="delete">Delete</button>
      </div>
    </div>
  `
}

function renderTemplates(templates: string[], parent: Element): void {
  parent.innerHTML = ""

  for (const t of templates) {
    parent.innerHTML += t
  }
}

saveTaskButton.addEventListener("click", async (e) => {
  e.preventDefault()

  const title = titleInput.value.trim()
  const description = descInput.value.trim()

  if (!title || !description) {
    alert("Please enter both title and description")
    return
  }

  const newTask: ToDoProps = {
    id: (tasks.length + 1).toString(),
    title: title,
    description: description,
    completed: false
  }

  const res = await ToDo.save(newTask)

  if (res.ok) {
    tasks.push(newTask)
    renderTemplates(tasks.map(createTodoTemplate), todoList)
  } else {
    console.log('Unable to save task')
  }
})

function markDone(id: string): void {
  const task = tasks.find((task) => task.id === id)

  if (task) {
    const newStatus = !task.completed

    ToDo.markDone(id, newStatus)
      .then((response) => {
        if (response.ok) {
          task.completed = newStatus

          renderTemplates(tasks.map(createTodoTemplate), todoList)

          const todoItem = todoList.querySelector(`[data-id="${id}"]`) as HTMLElement
          const button = todoItem?.querySelector(".actions button") as HTMLButtonElement

          if (button) {
            button.textContent = newStatus ? 'Undo' : 'Done'
            button.classList.toggle("done", !newStatus)
            button.classList.toggle("undo", newStatus)
          }
        } else {
          alert("Failed to mark task as done.")
        }
      })
      .catch((error) => {
        console.error("Error updating task:", error)
        alert("An error occurred while updating the task.")
      })
  }
}

function deleteTask(id: string): void {
  const taskIndex = tasks.findIndex((task) => task.id === id)

  if (taskIndex !== -1) {
    ToDo.deleteTask(id)
      .then((response) => {
        if (response.ok) {
          tasks.splice(taskIndex, 1)
          renderTemplates(tasks.map(createTodoTemplate), todoList)
        } else {
          alert("Failed to delete task.")
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error)
        alert("An error occurred while deleting the task.")
      })
  }
}

addButton.addEventListener("click", () => {
  formContainer.classList.toggle("hidden")
})
