import { Table } from "./initial-table";
import {
  initialDeleteTableButton,
  initialDeleteTaskButton,
} from "./delete-boxes-event";
import { initialAddTask } from "./add-task";

function initialTable(table: Table): Table {
  initialDeleteTaskButton(table);
  initialAddTask(table);
  initialDeleteTableButton(table);
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
