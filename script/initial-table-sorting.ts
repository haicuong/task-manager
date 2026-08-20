import { Table } from "./initial-table";

export function initialTableSorting(table: Table) {
  const sortingIcon = document.createElement("div");
  sortingIcon.classList =
    "flex absolute bottom-1 transform right-1 justify-center items-center size-5 bg-gray-400/50 p-1 rounded-full";
  sortingIcon.innerHTML = `<img src="assets/images/sorting-arrow-right.png" alt="">`;

  rotateSortingIconByOrder(sortingIcon, table.sortingOrderBy);

  const sortButtons = table.tableElement.querySelectorAll("[data-sorting]");

  for (const sortButton of sortButtons) {
    const sortBy = (sortButton as HTMLElement).dataset.sorting;
    if (table.sortingBy === sortBy) {
      sortButton.append(sortingIcon);
      break;
    }
  }

  table.tableElement.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const sortButton = event.target.closest("[data-sorting]");
    if (!sortButton || !(sortButton instanceof HTMLElement)) return;

    try {
      const sortBy = sortButton.dataset.sorting;
      table.setSorting(sortBy as "Name" | "Date");
    } catch (error) {
      console.error(`Can't sort table: ${error}`);
    }

    rotateSortingIconByOrder(sortingIcon, table.sortingOrderBy);
    sortButton.append(sortingIcon);
  });

  table.addEventListener("sorted", () => {
    table.storeTable();
    table.renderDOM();
  });
}

function rotateSortingIconByOrder(
  sortingIcon: HTMLDivElement,
  sortingOrder: "Asc" | "Desc",
) {
  if (sortingOrder === "Asc") sortingIcon.style.transform = `rotate(90deg)`;
  else if (sortingOrder === "Desc")
    sortingIcon.style.transform = `rotate(-90deg)`;
}
