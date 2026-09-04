import { Table } from "./initial-table";
import { initialDeleteTable, initialDeleteTask } from "./delete-boxes-event";
import { initialAddTask } from "./add-task";
import { initialChangeStatus } from "./event-manager";
import { initialStatusFilter } from "./initial-status-filter";
import { initialTableSorting } from "./initial-table-sorting";
import { loadAddTableButton } from "./add-table-button";
import { TableLoadError } from "./custom-errors";
import { asyncStorage } from "./async-storage";

//Fix safari UI touch
document.addEventListener("touchstart", () => {}, { passive: true });

const tables: Table[] = [];

const noTableFoundText = document.createElement("p");
noTableFoundText.classList =
  "mx-auto my-4 w-full flex items-center justify-center h-20 border-2 text-xl font-bold";
noTableFoundText.innerHTML = "No table found";
document.body.append(noTableFoundText);

document.body.addEventListener("tableListUpdate", () => {
  console.log(`Tables: ${tables.length}`);
  if (tables.length === 0) noTableFoundText.classList.remove("hidden");
  else noTableFoundText.classList.add("hidden");
});

document.body.addEventListener("tableDelete", (event) => {
  try {
    const customEvent = event as CustomEvent<Table>;

    const index = tables.indexOf(customEvent.detail);
    if (index !== -1) {
      tables.splice(index, 1);
    } else {
      throw new Error("Table not found in the list");
    }
  } catch (error) {
    console.error(`Can't delete table: ${error}`);
  }

  document.body.dispatchEvent(new CustomEvent("tableListUpdate"));
});

loadTableFromStorage();

export function setupTable(table: Table): Table {
  initialDeleteTask(table);
  initialAddTask(table);
  initialDeleteTable(table);
  initialChangeStatus(table);
  initialStatusFilter(table);
  initialTableSorting(table);

  tables.push(table);
  document.body.dispatchEvent(new CustomEvent("tableListUpdate"));

  return table;
}

export function createTable(table: Table): Table {
  setupTable(table);
  table.storeTable();
  table.renderDOM();
  return table;
}

async function loadTableFromStorage() {
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (key && key.startsWith("table_")) {
      try {
        const tableData = await asyncStorage.getItem(key);

        if (tableData) {
          const table = await Table.loadTable(tableData);
          if (table) {
            setupTable(table);
            table.renderDOM();
          }
        }
      } catch (error) {
        if (error instanceof TableLoadError) {
          console.warn(`Skipping corrupted table: ${key}, ${error.message}`);
        } else {
          console.error(`An unexpected error occur: ${error}`);
        }
      }
    }
  }
  loadAddTableButton(document.body);
}
