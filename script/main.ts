import { Table } from "./initial-table";
import { initialDeleteButton } from "./delete-box-event";
import { initialAddTask } from "./add-task";

const mainTable = initialTable("Test table");

for (let index = 0; index < 10; index++) {
  mainTable.addTask({
    name: `This is task ${index + 1}`,
    description: "This is description for task",
    priority: "Medium",
    date: new Date(),
  });
}

function initialTable(name: string): Table {
  const table = new Table(name);
  initialDeleteButton(table);
  initialAddTask(table);
  return table;
}
