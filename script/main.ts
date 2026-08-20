import { Table } from "./initial-table";
import { initialDeleteTable, initialDeleteTask } from "./delete-boxes-event";
import { initialAddTask } from "./add-task";
import { initialChangeStatus } from "./event-manager";
import { initialStatusFilter } from "./initial-status-filter";

function initialTable(table: Table): Table {
  initialDeleteTask(table);
  initialAddTask(table);
  initialDeleteTable(table);
  initialChangeStatus(table);
  initialStatusFilter(table);
  return table;
}

for (let index = 0; index < localStorage.length; index++) {
  const key = localStorage.key(index);
  if (key && key.startsWith("table_")) {
    const tableData = localStorage.getItem(key);

    if (tableData) {
      const table = Table.loadTable(tableData);
      if (table) initialTable(table);
    }
  }
}
