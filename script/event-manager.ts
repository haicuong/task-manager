import { Table } from "./initial-table";

export const DEFAULT_BUTTON_CLASSES =
  " bg-[#121212] rounded-xl p-2 border-2 border-white hover:bg-white/25 hover:cursor-pointer active:bg-white/50 active:text-shadow-md";

export function registerUnforcusedEvent(handler: (event: Event) => void) {
  document.addEventListener("keydown", handler);
  document.addEventListener("pointerdown", handler);
  document.addEventListener("wheel", handler, { passive: true });
}

export function createFixedHiddenDiv() {
  const div = document.createElement("div");
  div.classList = "bg-[#121212] border-2 border-white rounded-xl fixed hidden ";
  div.style.left = "0px";
  div.style.top = "0px";
  document.body.append(div);

  return div;
}

export function initialChangeStatus(table: Table) {
  table.tbodyElement.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const button = event.target.closest(".task-status");
    if (!button || !(button instanceof HTMLElement)) return;

    const taskElement = button.closest("[data-uuid]");
    if (!taskElement || !(taskElement instanceof HTMLElement)) return;

    const UUID = taskElement.dataset.uuid;
    if (!UUID) return;

    table.toogleTaskStatus(UUID);
  });

  table.addEventListener("taskStatusChange", () => {
    table.storeTable();
    table.renderDOM();
  });
}
