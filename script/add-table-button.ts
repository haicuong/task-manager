import { DEFAULT_BUTTON_CLASSES } from "./event-manager";
import { Table } from "./initial-table";
import { createTable } from "./main";

export function loadAddTableButton(parentElement: HTMLElement) {
  const form = document.createElement("form");
  form.classList =
    "bg-[#121212] mx-auto my-4 w-fit p-4 rounded-3xl border-2 border-white flex gap-2 items-center justify-center";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "table-name-input";
  nameInput.required = true;
  nameInput.placeholder = `Table name...`;
  nameInput.classList = `rounded-xl border p-2 border-white`;
  form.append(nameInput);

  const button = document.createElement("button");
  button.type = "submit";
  button.classList = `${DEFAULT_BUTTON_CLASSES} size-10`;
  button.innerHTML = `<img src="assets/images/plus-sign.png" class="invert" alt="">`;
  form.append(button);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    createTable(new Table(nameInput.value, form));
    nameInput.value = "";
  });

  parentElement.append(form);
}
