import { Table } from "./initial-table";
import { initialDeleteButton } from "./delete-box-event";
import { initialAddTask } from "./add-task";

const mainTable = initialTable("Test table");

function initialTable(name: string): Table {
  const table = new Table(name);
  initialDeleteButton(table);
  initialAddTask(table);
  return table;
}
