import { DEFAULT_BUTTON_CLASSES } from "./event-manager";
import { Table } from "./initial-table";
import { createTable } from "./main";

export function loadAddTableButton(parentElement: HTMLElement) {
  const form = document.createElement("form");
  form.classList =
    "bg-[#121212] mx-auto flex-col my-4 w-fit p-4 rounded-3xl border-2 border-white flex gap-4 items-center justify-center";
  form.innerHTML += `
    <h2 class="text-3xl font-bold">Add table</h2>
  `;

  const div = document.createElement("div");
  div.classList = "flex gap-2 items-center justify-center";
  form.append(div);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "table-name-input";
  nameInput.required = true;
  nameInput.placeholder = `Table name...`;
  nameInput.classList = `rounded-xl border p-2 border-white`;

  const button = document.createElement("button");
  button.type = "submit";
  button.classList = `${DEFAULT_BUTTON_CLASSES} size-10`;
  button.innerHTML = `<img src="images/plus-sign.png" class="invert" alt="">`;

  div.append(nameInput, button);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    createTable(new Table(nameInput.value, form));
    nameInput.value = "";
  });

  parentElement.append(form);
}
