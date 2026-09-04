import { Table } from "./initial-table";
import { createFixedHiddenDiv, registerUnforcusedEvent } from "./event-manager";
import { TaskNotFoundError } from "./custom-errors";

const deleteBox = createFixedHiddenDiv();
deleteBox.classList += " delete-container z-100";
const deleteButton = document.createElement("button");
deleteButton.classList =
  "delete-button rounded-sm p-2 hover:cursor-pointer hover:bg-white/25";
deleteBox.append(deleteButton);
document.body.append(deleteBox);

function showDeleteBox(event: MouseEvent) {
  deleteBox.classList.remove("hidden");
  deleteBox.style.left = `${Math.min(event.clientX, window.innerWidth - deleteBox.offsetWidth)}px`;
  deleteBox.style.top = `${Math.max(event.clientY - deleteBox.offsetHeight, 0)}px`;
}

function configureTaskDelete(table: Table, tr: HTMLElement, event: MouseEvent) {
  const taskName = tr.children[0]?.textContent?.trim() ?? "this";
  deleteButton.textContent = `Delete "${taskName}" task`;

  showDeleteBox(event);

  deleteButton.onclick = () => {
    if (!tr.dataset.uuid)
      throw new TaskNotFoundError(`Task's UUID not found`, table);

    table.deleteTask(tr.dataset.uuid);
    deleteBox.classList.add("hidden");
  };
}

function configureTableDelete(table: Table, event: MouseEvent) {
  if (!(event.target instanceof HTMLElement)) return;

  const caption = event.target.closest("[data-table-caption]");
  if (!caption || !(caption instanceof HTMLElement)) return;

  deleteButton.textContent = `Delete "${caption.textContent.trim()}" table`;

  showDeleteBox(event);

  if (!(deleteButton instanceof HTMLButtonElement)) return;
  deleteButton.onclick = () => {
    table.destroy();
    deleteBox.classList.add("hidden");
  };
}

export function initialDeleteTask(table: Table) {
  table.addEventListener("taskDeleted", () => {
    table.storeTable();
    table.renderDOM();
  });

  const openTaskDeleteBox = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement)) return;

    if (event.target.closest(".task-status, [data-tooltip-cursor]")) return;

    const tr = event.target.closest("tr");
    if (!(tr instanceof HTMLElement) || !tr.dataset.uuid) return;

    configureTaskDelete(table, tr, event);
  };

  table.tbodyElement.addEventListener("contextmenu", (event) => {
    openTaskDeleteBox(event);
    event.preventDefault();
  });

  if (window.matchMedia("(pointer: coarse)").matches) {
    table.tbodyElement.addEventListener("click", openTaskDeleteBox);
  }
}

/* export function initialDeleteTask(table: Table) {
  table.addEventListener("taskDeleted", () => {
    table.storeTable();
    table.renderDOM();
  });

  table.tbodyElement.addEventListener("contextmenu", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const tr = event.target.closest("TR");
    if (!tr || !(tr instanceof HTMLElement)) return;

    deleteButton!.textContent = `Delete "${tr.children[0].textContent.trim()}" task`;

    showDeleteBox(event);

    if (!(deleteButton instanceof HTMLButtonElement)) return;
    deleteButton!.onclick = () => {
      if (!tr.dataset.uuid)
        throw new TaskNotFoundError(`Task's UUID not found`, table);
      table.deleteTask(tr.dataset.uuid);
      deleteBox.classList.add("hidden");
    };

    event.preventDefault();
  });
} */

export async function initialDeleteTable(table: Table) {
  const openTableDeleteBox = (event: MouseEvent) => {
    configureTableDelete(table, event);
  };

  table.tableElement.addEventListener("contextmenu", (event) => {
    openTableDeleteBox(event);
    event.preventDefault();
  });

  if (window.matchMedia("(pointer: coarse)").matches) {
    table.tableElement.addEventListener("click", openTableDeleteBox);
  }
}

function hideDeleteBoxEvent(event: Event) {
  if (deleteBox.classList.contains("hidden")) return;

  if (!(event.target instanceof HTMLElement)) return;

  if (event.target.closest(".delete-container") === null)
    deleteBox.classList.add("hidden");
}

registerUnforcusedEvent(hideDeleteBoxEvent);
