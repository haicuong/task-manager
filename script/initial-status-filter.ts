import { Table } from "./initial-table";

export function initialStatusFilter(table: Table) {
  const button = table.tableElement.querySelector("[data-status-filter]");
  if (!button || !(button instanceof HTMLElement)) return;

  if (!table.statusFilter) table.statusFilter = "None";

  updateButton(button, table);

  table.addEventListener("statusFilterChange", () => {
    table.storeTable();
    table.renderDOM();
  });

  button.addEventListener("click", () => {
    table.toggleStatusFilter();

    updateButton(button, table);
  });
}

function updateButton(button: HTMLElement, table: Table) {
  button.dataset.statusFilter = table.statusFilter;
  button.textContent = table.statusFilter;

  switch (table.statusFilter) {
    case "None":
      button.style.color = "white";
      break;
    case "Complete":
      button.style.color = "green";
      break;
    case "Incomplete":
      button.style.color = "red";
      break;
  }
}
