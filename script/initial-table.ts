export type Task = {
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  date: Date;
  status: "Complete" | "Incomplete";
};

export class Table {
  name: string;
  tasksMap: Map<string, Task> = new Map();
  tasksOrderUUID: string[] = [];
  tableElement: HTMLTableElement = document.createElement("table");
  tbodyElement: HTMLTableSectionElement = document.createElement("tbody");
  statusFilter: "Incomplete" | "Complete" | "None" = "None";

  constructor(
    name: string,
    tableElement?: HTMLTableElement,
    tbodyElement?: HTMLTableSectionElement,
  ) {
    this.name = name;
    if (tableElement) this.tableElement = tableElement;
    if (tbodyElement) {
      if (tbodyElement.tagName !== "TBODY") throw new Error("Wrong tbody type");

      this.tbodyElement = tbodyElement;
    }

    this.tableElement.classList =
      "w-full m-4 mx-auto border-collapse border-2 border-white border-white";
    this.tableElement.innerHTML = `
      <caption class="border-x-2 border-t-2 border-white">
        <div class="relative flex justify-between items-center p-4">
          <button type="button" class="addTask hover:cursor-pointer hover:bg-white/25 bg-[#121212] border-2 border-white rounded-xl p-2">Add Task</button>
          <h1 data-table-caption class="font-bold text-xl">${name}</h1>
          <button class="font-bold p-2 rounded-xl border-2 border-white hover:bg-white/25" title="Click to filtering task by status" type="button" data-status-filter="${this.statusFilter}">${this.statusFilter}</button>
        </div>
      </caption>
      <thead>
      <tr>
      <th class="border-2 p-4 border-white text-center">Name</th>
      <th class="border-2 p-4 border-white text-center">Priority</th>
      <th class="border-2 p-4 border-white text-center">Date</th>
      <th class="border-2 p-4 border-white text-center">Status</th>
      </tr>
      </thead>`;
    this.tableElement.append(this.tbodyElement);
    document.body.append(this.tableElement);

    this.storeTable();
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

  updateStatusFilter(status: "Incomplete" | "Complete" | "None") {
    this.statusFilter = status;
    this.renderDOM();
  }

  toogleTaskStatus(UUID: string) {
    const task = this.tasksMap.get(UUID);
    if (!task) throw new Error("Task not found");

    if (task.status === "Complete") task.status = "Incomplete";
    else task.status = "Complete";

    this.storeTable();
    this.renderDOM();
  }

  destroy() {
    this.tasksMap.clear();
    this.tasksOrderUUID = [];
    this.tableElement.remove();

    localStorage.removeItem(`table_${this.name}`);
  }

  storeTable() {
    const tableData = {
      name: this.name,
      tasksMapEntries: Array.from(this.tasksMap),
      tasksOrder: this.tasksOrderUUID,
      statusFilter: this.statusFilter,
    };

    localStorage.setItem(`table_${this.name}`, JSON.stringify(tableData));
  }

  static loadTable(data: string) {
    const rawData = JSON.parse(data);
    if (!rawData) return null;

    try {
      const table = new Table(rawData.name);
      for (const [UUID, task] of rawData.tasksMapEntries) {
        const constructuredTask: Task = {
          ...task,
          date: new Date(task.date),
        };

        table.tasksMap.set(UUID, constructuredTask);
      }
      table.tasksOrderUUID = rawData.tasksOrder;
      table.statusFilter = rawData.statusFilter;

      table.storeTable();
      table.renderDOM();

      return table;
    } catch (error) {
      console.error(`Can't load table: ${error}`);
    }
  }

  addTask(task: Task) {
    const UUID = crypto.randomUUID();
    this.tasksMap.set(UUID, task);
    this.storeTable();
    this.renderDOM();
  }

  deleteTask(UUID: string) {
    this.tasksMap.delete(UUID);
    this.storeTable();
    this.renderDOM();
  }

  renderDOM() {
    this.tbodyElement.innerHTML = "";

    if (this.tasksMap.size === 0) {
      this.tbodyElement.innerHTML = `
        <span class="block m-0 mx-auto w-max p-4 italic">EMPTY TABLE</span>
      `;
      return;
    }

    this.tasksOrderUUID = [];
    for (const [UUID, task] of this.tasksMap) {
      console.log(`${task.name}: ${task.status}`);
      if (this.statusFilter === "None") this.tasksOrderUUID.push(UUID);
      else if (task.status === this.statusFilter)
        this.tasksOrderUUID.push(UUID);
    }

    /* if (this.statusFilter !== "None") {
      this.tasksOrderUUID.filter((UUID) => {
        const task = this.tasksMap.get(UUID);
        if (!task) return false;

        return task.status === this.statusFilter;
      });
    } */

    for (const UUID of this.tasksOrderUUID) {
      const task = this.tasksMap.get(UUID);
      if (!task) throw new Error(`Task with UUID ${UUID} not exist`);
      const tr = document.createElement("tr");
      tr.dataset.uuid = UUID;
      tr.innerHTML = `
        <td class="border-y-2 p-2 border-white text-center">
          <span data-tooltip-cursor="${task.description}">${task.name}</span>
        </td>
        <td class="border-y-2 p-2 ${getPriorityClassCSS(task.priority)} border-white text-center">${task.priority}</td>
        <td class="border-y-2 p-2 border-white text-center">${task.date.toLocaleDateString()}</td>
        <td class="border-y-2 p-2 border-white text-center">
          <button title="Click to change status" class="task-status hover:cursor-pointer font-bold ${task.status === "Complete" ? "text-green-400" : "text-red-400"} bg-[#121212] p-2 hover:bg-white/25 rounded-xl border-2 border-white" type="button">${task.status ?? "Incomplete"}</button>
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
