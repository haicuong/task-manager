export type Task = {
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  date: Date;
  status?: "Complete" | "Incomplete";
};

export class Table {
  name: string;
  tasksMap: Map<string, Task>;
  tasksOrder: string[];
  tableElement: HTMLTableElement;
  tbodyElement: HTMLTableSectionElement;

  constructor(
    name: string,
    tableElement?: HTMLTableElement,
    tbodyElement?: HTMLTableSectionElement,
  ) {
    this.name = name;
    this.tasksMap = new Map();
    this.tasksOrder = [];
    if (tableElement) this.tableElement = tableElement;
    else this.tableElement = document.createElement("table");
    if (tbodyElement) {
      if (tbodyElement.tagName !== "TBODY") throw new Error("Wrong tbody type");

      this.tbodyElement = tbodyElement;
    } else this.tbodyElement = document.createElement("tbody");

    this.tableElement.classList =
      "w-full m-4 mx-auto border-collapse border-2 border-white border-white";
    this.tableElement.innerHTML = `
      <caption class="border-x-2 border-t-2 border-white">
        <div class="relative flex justify-between items-center p-4">
          <button type="button" class="addTask hover:cursor-pointer hover:bg-white/25 bg-[#121212] border-2 border-white rounded-xl p-2">Add Task</button>
          <h1 class="font-bold text-xl">This is a task manager</h1>
          <button type="button" class="status">For Status Field</button>
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
  }

  addTask(task: Task) {
    const UUID = crypto.randomUUID();
    this.tasksMap.set(UUID, task);
    this.tasksOrder.push(UUID);
    this.renderDOM();
  }

  deleteTask(UUID: string) {
    this.tasksMap.delete(UUID);
    const indexOrder = this.tasksOrder.indexOf(UUID);
    if (indexOrder > -1) this.tasksOrder.splice(indexOrder, 1);
    this.renderDOM();
  }

  renderDOM() {
    this.tbodyElement.innerHTML = "";

    for (const UUID of this.tasksOrder) {
      const task = this.tasksMap.get(UUID);
      if (!task) throw new Error(`Task with UUID ${UUID} not exist`);
      const tr = document.createElement("tr");
      tr.dataset.uuid = UUID;
      tr.innerHTML = `
        <td class="border-y-2 p-2 border-white text-center">
          <span data-tooltip="${task.description}">${task.name}</span>
        </td>
        <td class="border-y-2 p-2 border-white text-center">${task.priority}</td>
        <td class="border-y-2 p-2 border-white text-center">${task.date.toLocaleString()}</td>
        <td class="border-y-2 p-2 border-white text-center">
          <button type="button">${task.status ?? "Incomplete"}</button>
        </td>
      `;

      this.tbodyElement.append(tr);
    }
  }
}
