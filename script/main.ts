import { Table } from "./initial-table";
import { initialDeleteTable, initialDeleteTask } from "./delete-boxes-event";
import { initialAddTask } from "./add-task";
import { initialChangeStatus } from "./event-manager";
import { initialStatusFilter } from "./initial-status-filter";
import { initialTableSorting } from "./initial-table-sorting";
import { loadAddTableButton } from "../add-table-button";

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
    const key = await localStorage.key(index);
    if (key && key.startsWith("table_")) {
      const tableData = await localStorage.getItem(key);

      if (tableData) {
        const table = await Table.loadTable(tableData);
        console.log(`Table: ${table ? "true" : "null"}`);
        if (table) initialTable(table);
      }
    }
  }

  loadAddTableButton(document.body);
}
