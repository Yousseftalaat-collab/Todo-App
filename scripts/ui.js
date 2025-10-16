import * as Todos from "./todos.js";
import { enableDragAndDrop } from "./dragdrop.js";
import { saveTodos } from "./storage.js";

const todoListEl = document.getElementById("todoList");
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const itemsLeftEl = document.getElementById("itemsLeft");
const clearBtn = document.getElementById("clearCompleted");
const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));
const themeToggle = document.getElementById("themeToggle");

let filter = "all";

function createTodoNode(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;
  li.draggable = true;

  const checkbox = document.createElement("button");
  checkbox.className = "todo-checkbox";
  if (todo.completed) {
    checkbox.classList.add("checked");
    checkbox.innerHTML = `<img src="./images/icon-check.svg" alt="Checked" />`;
  }

  const text = document.createElement("div");
  text.className = "todo-text" + (todo.completed ? " completed" : "");
  text.textContent = todo.text;

  const remove = document.createElement("button");
  remove.className = "remove-btn";
  remove.innerHTML = `<img src="./images/icon-cross.svg" alt="Remove" />`;

  li.append(checkbox, text, remove);
  return li;
}

export function render() {
  const todos = Todos.getTodos();
  todoListEl.innerHTML = "";

  const filtered = todos.filter((t) => {
    if (filter === "all") return true;
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
  });

  filtered.forEach((t) => todoListEl.appendChild(createTodoNode(t)));
  updateCount();
}

function updateCount() {
  const left = Todos.getTodos().filter((t) => !t.completed).length;
  itemsLeftEl.textContent = `${left} item${left !== 1 ? "s" : ""} left`;
}

function handleListClick(e) {
  const li = e.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.closest(".remove-btn")) {
    Todos.deleteTodo(id);
    render();
  } else {
    Todos.toggleTodo(id);
    render();
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const val = todoInput.value.trim();
  if (!val) return;
  Todos.addTodo(val);
  todoInput.value = "";
  render();
}

function bindEvents() {
  todoListEl.addEventListener("click", handleListClick);
  todoForm.addEventListener("submit", handleFormSubmit);

  clearBtn.addEventListener("click", () => {
    Todos.clearCompleted();
    render();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filter = btn.dataset.filter;
      render();
    });
  });

  // Theme toggle logic
  themeToggle.addEventListener("click", () => {
    const body = document.body;
    const isDark = body.dataset.theme === "dark";
    const newTheme = isDark ? "light" : "dark";
    body.dataset.theme = newTheme;
    localStorage.setItem("todoApp.theme", newTheme);

    const iconName = newTheme === "dark" ? "sun" : "moon";
    themeToggle.innerHTML = `<img src="./images/icon-${iconName}.svg" alt="Switch theme" />`;
  });

  enableDragAndDrop(todoListEl, (ids) => {
    Todos.reorderTodos(ids);
    render();
  });
}

export function initTheme() {
  const saved = localStorage.getItem("todoApp.theme") || "dark";
  document.body.dataset.theme = saved;
  const iconName = saved === "dark" ? "sun" : "moon";
  themeToggle.innerHTML = `<img src="./images/icon-${iconName}.svg" alt="Switch theme" />`;
}

export function init() {
  initTheme();
  bindEvents();
  render();
}
