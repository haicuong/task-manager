import { asyncStorage } from "./async-storage";
import {
  TableLoadError,
  TaskNotFoundError,
  TbodyTagNotMatchError,
} from "./custom-errors";
import { DEFAULT_BUTTON_CLASSES } from "./event-manager";

export type Task = {
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  date: Date;
  status: "Complete" | "Incomplete";
  UUID?: string;
};

export class Table extends EventTarget {
  name: string;
  tasksMap: Map<string, Task> = new Map();
  tasksOrder: Task[] = [];
  tableElement: HTMLTableElement = document.createElement("table");
  tbodyElement: HTMLTableSectionElement = document.createElement("tbody");
  statusFilter: "Incomplete" | "Complete" | "None" = "None";
  sortingOrderBy: "Desc" | "Asc" = "Asc";
  sortingBy: "Name" | "Date" = "Name";

  constructor(
    name: string,
    addTableElement?: HTMLElement,
    tableElement?: HTMLTableElement,
    tbodyElement?: HTMLTableSectionElement,
  ) {
    super();
    this.name = name;
    if (tableElement) this.tableElement = tableElement;
    if (tbodyElement) {
      if (tbodyElement.tagName !== "TBODY") throw new TbodyTagNotMatchError();

      this.tbodyElement = tbodyElement;
    }

    this.tableElement.classList =
      "w-full m-4 mx-auto border-collapse border-2 border-white border-white";
    this.tableElement.innerHTML = `
      <caption class="border-x-2 border-t-2 border-white">
        <div class="relative flex justify-between items-center p-4">
          <button type="button" class="addTask ${DEFAULT_BUTTON_CLASSES}">Add Task</button>
          <h1 data-table-caption class="font-bold text-xl">${name}</h1>
          <button class="font-bold ${DEFAULT_BUTTON_CLASSES}" title="Click to filtering task by status" type="button" data-status-filter="${this.statusFilter}">${this.statusFilter}</button>
        </div>
      </caption>
      <thead>
      <tr>
      <th data-sorting="Name" title="Click to sort by name" class="border-2 select-none relative p-4 hover:bg-white/25 hover:cursor-pointer border-white text-center">Name</th>
      <th class="border-2 p-4 border-white text-center">Priority</th>
      <th data-sorting="Date" title="Click to sort by date" class="border-2 select-none relative p-4 hover:bg-white/25 hover:cursor-pointer border-white text-center">Date</th>
      <th class="border-2 p-4 border-white text-center">Status</th>
      </tr>
      </thead>`;
    this.tableElement.append(this.tbodyElement);
    if (addTableElement) addTableElement.before(this.tableElement);
    else document.body.append(this.tableElement);

    this.storeTable();
    this.renderDOM();
  }

  setSorting(sortingBy: "Name" | "Date", sortingOrderBy?: "Desc" | "Asc") {
    if (sortingOrderBy) this.sortingOrderBy = sortingOrderBy;
    else if (sortingBy === this.sortingBy) {
      if (this.sortingOrderBy === "Asc") this.sortingOrderBy = "Desc";
      else this.sortingOrderBy = "Asc";
    } else this.sortingOrderBy = "Asc";
    this.sortingBy = sortingBy;

    this.dispatchEvent(new CustomEvent("sorted"));
  }

  toggleStatusFilter() {
    switch (this.statusFilter) {
      case "None":
        this.statusFilter = "Incomplete";
        this.renderDOM();
        break;
      case "Incomplete":
        this.statusFilter = "Complete";
        this.renderDOM();
        break;
      case "Complete":
        this.statusFilter = "None";
        this.renderDOM();
        break;
    }
    this.storeTable();
  }

  toogleTaskStatus(UUID: string) {
    const task = this.tasksMap.get(UUID);
    if (!task)
      throw new TaskNotFoundError(
        `Task with UUID ${UUID} not found`,
        this,
        UUID,
      );

    if (task.status === "Complete") task.status = "Incomplete";
    else task.status = "Complete";

    this.dispatchEvent(new CustomEvent("taskStatusChange"));
  }

  async destroy() {
    this.tasksMap.clear();
    this.tasksOrder = [];
    this.tableElement.remove();

    await asyncStorage.removeItem(`table_${this.name}`);
  }

  async storeTable() {
    const tableData = {
      name: this.name,
      tasksMapEntries: Array.from(this.tasksMap),
      tasksOrder: this.tasksOrder,
      statusFilter: this.statusFilter,
      sortingOrderBy: this.sortingOrderBy,
      sortingBy: this.sortingBy,
    };

    await asyncStorage.setItem(`table_${this.name}`, JSON.stringify(tableData));
  }

  static async loadTable(data: string) {
    const rawData = JSON.parse(data);
    if (!rawData || !rawData.name) return null;

    const table = new Table(rawData.name);
    try {
      for (const [UUID, task] of rawData.tasksMapEntries) {
        const constructuredTask: Task = {
          ...task,
          date: new Date(task.date),
        };

        table.tasksMap.set(UUID, constructuredTask);
      }
      table.tasksOrder = rawData.tasksOrder;
      table.statusFilter = rawData.statusFilter;
      table.sortingOrderBy = rawData.sortingOrderBy;
      table.sortingBy = rawData.sortingBy;
    } catch (error) {
      if (error instanceof Error) {
        throw new TableLoadError(error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }

    table.storeTable();
    table.renderDOM();

    return table;
  }

  addTask(task: Task) {
    const UUID = crypto.randomUUID();
    task.UUID = UUID;
    this.tasksMap.set(UUID, task);
    this.dispatchEvent(new CustomEvent("taskAdded", { detail: task }));
  }

  deleteTask(UUID: string) {
    this.tasksMap.delete(UUID);
    this.dispatchEvent(new CustomEvent("taskDeleted", { detail: UUID }));
  }

  renderDOM() {
    this.tbodyElement.innerHTML = "";

    this.tasksOrder = [];
    for (const [_, task] of this.tasksMap) {
      if (!this.statusFilter || this.statusFilter === "None")
        this.tasksOrder.push(task);
      else if (task.status === this.statusFilter) this.tasksOrder.push(task);
    }

    if (this.tasksOrder.length === 0) {
      this.tbodyElement.innerHTML = `
        <span class="block m-0 mx-auto font-bold w-max p-4 italic">No Task Found</span>
      `;
      return;
    }

    if (this.sortingBy === "Name") {
      this.tasksOrder.sort((taskA, taskB) => {
        if (this.sortingOrderBy === "Asc")
          return taskA.name.localeCompare(taskB.name);
        else return taskB.name.localeCompare(taskA.name);
      });
    } else if (this.sortingBy === "Date") {
      this.tasksOrder.sort((taskA, taskB) => {
        if (this.sortingOrderBy === "Asc") {
          return (
            taskA.date.getTime() - taskB.date.getTime() ||
            taskA.name.localeCompare(taskB.name)
          );
        } else
          return (
            taskB.date.getTime() - taskA.date.getTime() ||
            taskB.name.localeCompare(taskA.name)
          );
      });
    }

    for (const task of this.tasksOrder) {
      const tr = document.createElement("tr");
      tr.dataset.uuid = task.UUID;
      tr.innerHTML = `
        <td class="border-y-2 p-2 border-white text-center">
          <span data-tooltip-cursor="${task.description}">${task.name}</span>
        </td>
        <td class="border-y-2 p-2 ${getPriorityClassCSS(task.priority)} border-white text-center">${task.priority}</td>
        <td class="border-y-2 p-2 border-white text-center"><span data-tooltip-cursor="${task.date.toLocaleString()}">${task.date.toLocaleDateString()}</span></td>
        <td class="border-y-2 p-2 border-white text-center">
          <button title="Click to change status" class="task-status font-bold ${task.status === "Complete" ? "text-green-400" : "text-red-400"} ${DEFAULT_BUTTON_CLASSES}" type="button">${task.status ?? "Incomplete"}</button>
        </td>
      `;

      this.tbodyElement.append(tr);
    }
  }
}

function getPriorityClassCSS(priority: "Low" | "Medium" | "High") {
  switch (priority) {
    case "Low":
      return "text-green-400";
    case "Medium":
      return "text-yellow-400";
    case "High":
      return "text-red-400";
  }
}
