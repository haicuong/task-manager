import { Task, Table } from "./initial-table";

const addTaskForm = document.createElement("form");

export function initialAddTask(table: Table) {
  const button = table.tableElement.querySelector(".addTask");
  if (!button || !(button instanceof HTMLButtonElement)) return;
}
