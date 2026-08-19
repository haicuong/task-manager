import { Table } from "./initial-table";
import { createFixedHiddenDiv, registerUnforcusedEvent } from "./event-manager";

const deleteBox = createFixedHiddenDiv();
deleteBox.classList.add("delete-container");
const deleteButton = document.createElement("button");
deleteButton.classList =
  "delete-button rounded-sm p-2 hover:cursor-pointer hover:bg-white/25";
deleteBox.append(deleteButton);
document.body.append(deleteBox);

export function initialDeleteButton(table: Table) {
  table.tbodyElement.addEventListener("contextmenu", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const tr = event.target.closest("TR");
    if (!tr || !(tr instanceof HTMLElement)) return;

    deleteBox.style.left = "0px";
    deleteButton!.textContent = `Delete "${tr.children[0].textContent}" task`;

    deleteBox.classList.remove("hidden");
    deleteBox.style.left = `${Math.min(event.clientX, window.innerWidth - deleteBox.offsetWidth)}px`;
    deleteBox.style.top = `${Math.max(event.clientY - deleteBox.offsetHeight, 0)}px`;

    if (!(deleteButton instanceof HTMLButtonElement)) return;
    deleteButton!.onclick = () => {
      if (!tr.dataset.uuid) throw new Error(`Task not have UUID`);
      table.deleteTask(tr.dataset.uuid);
      deleteBox.classList.add("hidden");
    };

    event.preventDefault();
  });
}

function hideDeleteBoxEvent(event: Event) {
  if (deleteBox.classList.contains("hidden")) return;

  if (!(event.target instanceof HTMLElement)) return;

  if (event.target.closest(".delete-container") === null)
    deleteBox.classList.add("hidden");
}

registerUnforcusedEvent(hideDeleteBoxEvent);
