import { Table } from "./initial-table";
import { createFixedHiddenDiv, registerUnforcusedEvent } from "./event-manager";

const addTaskBox = createFixedHiddenDiv();
addTaskBox.className += " add-task-box p-4 w-fit";
addTaskBox.innerHTML = `
  <form action="" class="flex flex-col gap-2">
    <article>
      <label for="name-input" class="mr-2">Task name: </label>
      <input class="p-1 border-[0.5px]" type="text" id="name-input" name="nameInput" required placeholder="New task">
    </article>
    <article>
      <label for="description-input" class="mr-2">Description: </label>
      <input class="p-1 border-[0.5px]" type="text" id="description-input" name="descriptionInput" required placeholder="Daily task">
    </article>
    <article>
      <label for="priority-input" class="mr-2">Priority: </label>
      <select required class="border-[0.5px] p-1" name="priorityInput" id="priority-input">
        <option class="bg-[#121212]" value="Low">Low</option>
        <option class="bg-[#121212]" value="Medium">Medium</option>
        <option class="bg-[#121212]" value="High">High</option>
      </select>
    </article>
    <article>
      <label class="mr-2" for="date-input">Date: </label>
      <input class="bg-[#121212] border-[0.5px] p-1 scheme-dark" id="date-input" name="dateInput" required type="date">
    </article>
    <button class="p-2 border border-white rounded-xl mt-2 hover:bg-white/25 hover:cursor-pointer" type="submit">Submit</button>
  </form>`;
document.body.append(addTaskBox);
addTaskBox.style.top = "0px";
addTaskBox.style.left = "0px";

function hideAddTaskBoxEvent(event: Event) {
  if (addTaskBox.classList.contains("hidden")) return;

  if (!(event.target instanceof HTMLElement)) return;

  if (
    event.target.closest(".add-task-box") === null &&
    event.target.closest(".addTask") === null
  )
    addTaskBox.classList.add("hidden");
}

export function initialAddTask(table: Table) {
  const addTaskButton = table.tableElement.querySelector(".addTask");
  if (!addTaskButton || !(addTaskButton instanceof HTMLButtonElement)) return;

  addTaskButton.addEventListener("click", (event) => {
    addTaskBox.classList.remove("hidden");
    const buttonRect = addTaskButton.getBoundingClientRect();
    addTaskBox.style.top = `${buttonRect.bottom}px`;
    addTaskBox.style.left = `${buttonRect.left}px`;

    const nameInput = addTaskBox.querySelector<HTMLInputElement>("#name-input");
    if (nameInput) nameInput.value = "";
    const descriptionInput =
      addTaskBox.querySelector<HTMLInputElement>("#description-input");
    if (descriptionInput) descriptionInput.value = "";
    const priorityInput =
      addTaskBox.querySelector<HTMLSelectElement>("#priority-input");
    if (priorityInput) priorityInput.value = "Low";

    const dateInput = addTaskBox.querySelector("#date-input");
    if (!(dateInput instanceof HTMLInputElement))
      throw new Error("Not found date input");

    dateInput.valueAsDate = new Date();
  });

  const form = addTaskBox.querySelector("form");
  if (!form) throw Error("Form not found on initial Add Task Box");

  form.addEventListener("submit", (event) => {
    if (!(event.target instanceof HTMLFormElement)) return;
    event.preventDefault();

    const formData = new FormData(event.target);

    const name = formData.get("nameInput") as string;
    const description = formData.get("descriptionInput") as string;
    const priority = formData.get("priorityInput") as string as
      | "Low"
      | "Medium"
      | "High";
    const date = new Date(formData.get("dateInput") as string);

    table.addTask({
      name,
      description,
      priority,
      date,
      status: "Incomplete",
    });

    addTaskBox.classList.add("hidden");
  });
}

registerUnforcusedEvent(hideAddTaskBoxEvent);
