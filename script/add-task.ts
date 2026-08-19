import { Table } from "./initial-table";
import { createFixedHiddenDiv, registerUnforcusedEvent } from "./event-manager";

const addTaskBox = createFixedHiddenDiv();
addTaskBox.className += " add-task-box p-4 w-fit";
addTaskBox.innerHTML = `
  <form action="" class="flex flex-col gap-1">
    <article>
      <label for="name-input" class="mr-2">Task name: </label>
      <input class="p-1 border-[0.5px]" type="text" id="name-input" name="nameInput" required placeholder="New task">
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
    <button type="submit">Submit</button>
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

    const dateInput = addTaskBox.querySelector("#date-input");
    if (!(dateInput instanceof HTMLInputElement))
      throw new Error("Not found date input");

    dateInput.valueAsDate = new Date();
  });

  const submitButton = addTaskBox.querySelector('input[type="submit"]');
  if (!submitButton || !(submitButton instanceof HTMLButtonElement)) return;
}

registerUnforcusedEvent(hideAddTaskBoxEvent);
