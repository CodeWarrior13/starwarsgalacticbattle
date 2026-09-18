const STORAGE_KEY = "todo-list-tasks";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const clearAllButton = document.querySelector("#clear-all");
const filterButtons = document.querySelectorAll(".filter-button");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(text) {
  return { id: crypto.randomUUID(), text: text.trim(), completed: false };
}

function visibleTasks() {
  if (currentFilter === "active") return tasks.filter((task) => !task.completed);
  if (currentFilter === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}

function render() {
  const displayedTasks = visibleTasks();
  list.replaceChildren();
  emptyState.hidden = displayedTasks.length > 0;

  displayedTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `todo-item${task.completed ? " completed" : ""}`;
    item.dataset.id = task.id;

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.textContent = "×";

    label.append(checkbox, text);
    item.append(label, deleteButton);
    list.append(item);
  });

  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
  clearCompletedButton.disabled = !tasks.some((task) => task.completed);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift(createTask(text));
  saveTasks();
  input.value = "";
  render();
  input.focus();
});

list.addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const task = tasks.find((item) => item.id === event.target.closest(".todo-item").dataset.id);
  if (task) {
    task.completed = event.target.checked;
    saveTasks();
    render();
  }
});

list.addEventListener("click", (event) => {
  if (!event.target.matches(".delete-button")) return;
  const id = event.target.closest(".todo-item").dataset.id;
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => filterButton.classList.toggle("active", filterButton === button));
    render();
  });
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

clearAllButton.addEventListener("click", () => {
  if (!tasks.length || !window.confirm("Delete all tasks?")) return;
  tasks = [];
  saveTasks();
  render();
});

render();
