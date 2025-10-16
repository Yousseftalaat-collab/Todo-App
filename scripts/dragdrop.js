// dragdrop.js - attachable drag & drop handlers for a ul.todo-list
export function enableDragAndDrop(listEl, onReorder) {
  let dragId = null;

  listEl.addEventListener("dragstart", (e) => {
    const li = e.target.closest('[draggable="true"]');
    if (!li) return;
    dragId = li.dataset.id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dragId);
    li.classList.add("dragging");
  });

  listEl.addEventListener("dragend", (e) => {
    const li = e.target.closest('[draggable="true"]');
    if (li) li.classList.remove("dragging");
    dragId = null;
  });

  listEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    const after = getDragAfterElement(listEl, e.clientY);
    const dragging = listEl.querySelector(".dragging");
    if (!dragging) return;
    if (after == null) {
      listEl.appendChild(dragging);
    } else {
      listEl.insertBefore(dragging, after);
    }
  });

  listEl.addEventListener("drop", (e) => {
    e.preventDefault();
    // collect new order and call onReorder(ids)
    const ids = Array.from(listEl.querySelectorAll("li")).map(
      (li) => li.dataset.id
    );
    if (typeof onReorder === "function") onReorder(ids);
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll("li:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}
