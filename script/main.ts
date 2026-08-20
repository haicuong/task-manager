import { Table } from "./initial-table";
import { initialDeleteTable, initialDeleteTask } from "./delete-boxes-event";
import { initialAddTask } from "./add-task";
import { initialChangeStatus } from "./event-manager";
import { initialStatusFilter } from "./initial-status-filter";
import { initialTableSorting } from "./initial-table-sorting";
import { loadAddTableButton } from "../add-table-button";
import { TableLoadError } from "./custom-errors";
import { asyncStorage } from "./async-storage";

loadTableFromStorage();

export function initialTable(table: Table): Table {
  initialDeleteTask(table);
  initialAddTask(table);
  initialDeleteTable(table);
  initialChangeStatus(table);
  initialStatusFilter(table);
  initialTableSorting(table);
  console.log(`Table ${table.name} initialed`);
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
          if (table) initialTable(table);
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
