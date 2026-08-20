import { Table } from "./initial-table";
import { createFixedHiddenDiv, registerUnforcusedEvent } from "./event-manager";
import { TaskNotFoundError } from "./custom-errors";

const deleteBox = createFixedHiddenDiv();
deleteBox.classList.add("delete-container");
deleteBox.classList.add("z-100");
const deleteButton = document.createElement("button");
deleteButton.classList =
  "delete-button rounded-sm p-2 hover:cursor-pointer hover:bg-white/25";
deleteBox.append(deleteButton);
document.body.append(deleteBox);

function showDeleteBox(event: PointerEvent) {
  deleteBox.classList.remove("hidden");
  deleteBox.style.left = `${Math.min(event.clientX, window.innerWidth - deleteBox.offsetWidth)}px`;
  deleteBox.style.top = `${Math.max(event.clientY - deleteBox.offsetHeight, 0)}px`;
}

export function initialDeleteTask(table: Table) {
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
}

export function initialDeleteTable(table: Table) {
  table.tableElement.addEventListener("contextmenu", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const caption = event.target.closest("[data-table-caption]");
    if (!caption || !(caption instanceof HTMLElement)) return;

    event.preventDefault();

    deleteButton!.textContent = `Delete "${caption.textContent.trim()}" table`;

    showDeleteBox(event);

    if (!(deleteButton instanceof HTMLButtonElement)) return;
    deleteButton!.onclick = () => {
      table.destroy();
      deleteBox.classList.add("hidden");
    };
  });

  table.addEventListener("destroy", () => {
    localStorage.removeItem(`table_${table.name}`);
  });
}

function hideDeleteBoxEvent(event: Event) {
  if (deleteBox.classList.contains("hidden")) return;

  if (!(event.target instanceof HTMLElement)) return;

  if (event.target.closest(".delete-container") === null)
    deleteBox.classList.add("hidden");
}

registerUnforcusedEvent(hideDeleteBoxEvent);
