import { createFixedHiddenDiv } from "./event-manager";

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

  requestAnimationID = requestAnimationFrame(updateTooltipBoxTransform);
  // tooltipBox.style.top = `${elementRect.bottom}px`;
  // tooltipBox.style.left = `${elementRect.left}px`;
});

document.addEventListener("mousemove", (event) => {
  if (!(event.target instanceof HTMLElement)) return;

  const HTMLToTooltip = event.target.closest("[data-tooltip]");
  if (!(HTMLToTooltip instanceof HTMLElement)) return;

  cursorX = event.clientX;
  cursorY = event.clientY;
});

let cursorX = 0;
let cursorY = 0;

let requestAnimationID: number | null = null;

let tooltipX = 0;
let tooltipY = 0;

function updateTooltipBoxTransform() {
  if (tooltipX !== cursorX || tooltipY !== cursorY) {
    tooltipX = cursorX;
    tooltipY = cursorY;
    tooltipBox.style.transform = `translate(${tooltipX}px, ${tooltipY}px)`;
  }

  requestAnimationID = requestAnimationFrame(updateTooltipBoxTransform);
}

document.addEventListener("mouseout", (event) => {
  if (tooltipBox.classList.contains("hidden")) return;
  if (!(event.target instanceof HTMLElement)) return;

  const HTMLToTooltip = event.target.closest("[data-tooltip]");
  if (!(HTMLToTooltip instanceof HTMLElement)) return;

  tooltipBox.classList.add("hidden");

  if (requestAnimationID) {
    cancelAnimationFrame(requestAnimationID);
    requestAnimationID = null;
  }
});
