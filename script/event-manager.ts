export function registerUnforcusedEvent(handler: (event: Event) => void) {
  document.addEventListener("keydown", handler);
  document.addEventListener("mousedown", handler);
  document.addEventListener("wheel", handler);
}

export function createFixedHiddenDiv() {
  const div = document.createElement("div");
  div.classList = "bg-[#121212] border-2 border-white rounded-xl fixed hidden ";
  div.style.left = "0px";
  div.style.top = "0px";
  document.body.append(div);

  return div;
}

//Tooltip event

const tooltipBox = createFixedHiddenDiv();
tooltipBox.className += " pointer-events-none max-w-[50%] p-2";

document.addEventListener("mouseover", (event) => {
  if (!(event.target instanceof HTMLElement)) return;

  const HTMLToTooltip = event.target.closest("[data-tooltip]");
  if (!(HTMLToTooltip instanceof HTMLElement)) return;

  const messenge = HTMLToTooltip.dataset.tooltip;
  if (!messenge) return;

  const elementRect = HTMLToTooltip.getBoundingClientRect();

  tooltipBox.textContent = messenge;
  tooltipBox.classList.remove("hidden");
  tooltipBox.style.top = `${elementRect.bottom}px`;
  tooltipBox.style.left = `${elementRect.left}px`;
});

document.addEventListener("mouseout", (event) => {
  if (tooltipBox.classList.contains("hidden")) return;
  if (!(event.target instanceof HTMLElement)) return;

  const HTMLToTooltip = event.target.closest("[data-tooltip]");
  if (!(HTMLToTooltip instanceof HTMLElement)) return;

  tooltipBox.classList.add("hidden");
});
