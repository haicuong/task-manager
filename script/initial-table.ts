export type Task = {
  name: string;
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
  selecting: Task | undefined;

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
          <button type="button" class="addTask">For Adding Task</button>
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
    this.updateDOM();
  }

  updateDOM() {
    this.tbodyElement.innerHTML = "";

    for (const [UUID, task] of this.tasksMap) {
      const tr = document.createElement("tr");
      tr.dataset.uuid = UUID;
      tr.innerHTML = `
        <td class="border-y-2 p-2 border-white text-center">${task.name}</td>
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

document.addEventListener("keydown", hideDeleteBoxEvent);
document.addEventListener("mousedown", hideDeleteBoxEvent);
document.addEventListener("wheel", hideDeleteBoxEvent);

const deleteBox = document.createElement("div");
deleteBox.classList =
  "bg-[#121212] border-2 border-white rounded-xl fixed hidden delete-container";
deleteBox.style.left = "0px";
deleteBox.style.top = "0px";
deleteBox.innerHTML = `<button class="delete-button rounded-sm p-2 hover:cursor-pointer hover:bg-white/25"></button>`;
document.body.append(deleteBox);

export function initialTable(name: string): Table {
  const table = new Table(name);
  initialDeleteButton(table);
  return table;
}

function initialDeleteButton(table: Table) {
  table.tbodyElement.addEventListener("contextmenu", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const tr = event.target.closest("TR");
    if (!tr || !(tr instanceof HTMLElement)) return;

    const deleteButton = deleteBox.querySelector(".delete-button");
    deleteBox.style.left = "0px";
    deleteButton!.textContent = `Delete "${tr.children[0].textContent}" task`;

    deleteBox.classList.remove("hidden");
    deleteBox.style.left = `${Math.min(event.clientX, window.innerWidth - deleteBox.offsetWidth)}px`;
    deleteBox.style.top = `${Math.max(event.clientY - deleteBox.offsetHeight, 0)}px`;

    if (!(deleteButton instanceof HTMLButtonElement)) return;
    deleteButton!.onclick = () => {
      if (tr.dataset.uuid) table.tasksMap.delete(tr.dataset.uuid);
      table.updateDOM();
      deleteBox.classList.add("hidden");
    };

    event.preventDefault();
  });
}

function hideDeleteBoxEvent(event: Event) {
  if (deleteBox.classList.contains("hidden")) return;

  if (!(event.target instanceof HTMLElement)) return;

  if (event.target.closest(".delete-container") === null)
    deleteBox.classList.add("hidden");
}
