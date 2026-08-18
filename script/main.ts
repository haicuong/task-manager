import { initialTable } from "./initial-table";

const mainTable = initialTable("Test table");

for (let index = 0; index < 10; index++) {
  mainTable.addTask({
    name: `This is task ${index + 1}`,
    priority: "Medium",
    date: new Date(),
  });
}
