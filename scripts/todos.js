// todos.js - data model + helpers
import { saveTodos, loadTodos } from "./storage.js";

let todos = loadTodos(); // array of {id, text, completed}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getTodos() {
  return todos.slice();
}

export function addTodo(text) {
  const t = { id: genId(), text: text.trim(), completed: false };
  if (!t.text) return null;
  todos.unshift(t); // newest on top
  saveTodos(todos);
  return t;
}

export function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos(todos);
}

export function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos(todos);
}

export function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos(todos);
}

export function reorderTodos(newOrderArrayOfIds) {
  const map = new Map(todos.map((t) => [t.id, t]));
  todos = newOrderArrayOfIds.map((id) => map.get(id)).filter(Boolean);
  saveTodos(todos);
}

// for initializing (e.g. testing)
export function setTodos(newTodos) {
  todos = newTodos;
  saveTodos(todos);
}
