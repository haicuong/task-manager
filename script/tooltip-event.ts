import { createFixedHiddenDiv } from "./event-manager";

const tooltipBox = createFixedHiddenDiv();
tooltipBox.className += " pointer-events-none max-w-[50%] p-2";

document.addEventListener("mouseover", (event) => {
  if (!(event.target instanceof HTMLElement)) return;

  const HTMLToTooltip = event.target.closest(
    "[data-tooltip-box], [data-tooltip-cursor]",
  );
  if (!(HTMLToTooltip instanceof HTMLElement)) return;

  let messenge: string | undefined;

  if (HTMLToTooltip.hasAttribute("data-tooltip-box")) {
    messenge = HTMLToTooltip.dataset.tooltipBox;
    if (!messenge) return;
    tooltipBox.textContent = messenge;
    tooltipBoxRect = tooltipBox.getBoundingClientRect();
    calculateTooltipPosition(HTMLToTooltip);
  } else if (HTMLToTooltip.hasAttribute("data-tooltip-cursor")) {
    messenge = HTMLToTooltip.dataset.tooltipCursor;
    if (!messenge) return;
    tooltipBox.textContent = messenge;
    tooltipBoxRect = tooltipBox.getBoundingClientRect();
    requestAnimationID = requestAnimationFrame(updateTooltipBoxTransform);
  }

  tooltipBox.classList.remove("hidden");
});

//Tooltip cursor
document.addEventListener("mousemove", (event) => {
  if (!(event.target instanceof HTMLElement)) return;

  const HTMLToTooltip = event.target.closest("[data-tooltip-cursor]");
  if (!(HTMLToTooltip instanceof HTMLElement)) return;

  cursorX = event.clientX;
  cursorY = event.clientY;
});

let cursorX = 0;
let cursorY = 0;

let requestAnimationID: number | null = null;

let tooltipX = 0;
let tooltipY = 0;

let tooltipBoxRect: DOMRect | null = null;

function updateTooltipBoxTransform() {
  if ((tooltipX !== cursorX || tooltipY !== cursorY) && tooltipBoxRect) {
    tooltipX = cursorX;
    tooltipY = cursorY;

    calculateTooltipTransform(cursorX, cursorY);
  }

  requestAnimationID = requestAnimationFrame(updateTooltipBoxTransform);
}

function calculateTooltipTransform(x: number, y: number) {
  if (!tooltipBoxRect) return;

  const finalX = Math.min(x, window.innerWidth - tooltipBoxRect.width);
  const finalY =
    y + tooltipBoxRect.height <= window.innerHeight
      ? y
      : y - tooltipBoxRect.height;

  tooltipBox.style.transform = `translate(${finalX}px, ${finalY}px)`;
}

function calculateTooltipPosition(targetElement: HTMLElement) {
  if (!tooltipBoxRect) return;
  if (!targetElement) return;

  const targetRect = targetElement.getBoundingClientRect();

  const y =
    targetRect.bottom + tooltipBoxRect.height <=
    document.documentElement.clientHeight
      ? targetRect.bottom
      : targetRect.top - tooltipBoxRect.height;

  const finalX = Math.min(
    targetRect.left,
    window.innerWidth - tooltipBoxRect.width,
  );
  const finalY =
    y + tooltipBoxRect.height <= window.innerHeight
      ? y
      : y - tooltipBoxRect.height;

  tooltipBox.style.left = `${finalX}px`;
  tooltipBox.style.top = `${finalY}px`;
}

function resetTooltip() {
  tooltipBox.style.left = `0px`;
  tooltipBox.style.top = `0px`;
  tooltipBox.style.transform = `translate(0px, 0px)`;
}

document.addEventListener("mouseout", (event) => {
  if (tooltipBox.classList.contains("hidden")) return;
  if (!(event.target instanceof HTMLElement)) return;

  const HTMLToTooltip = event.target.closest(
    "[data-tooltip-box], [data-tooltip-cursor]",
  );
  if (!(HTMLToTooltip instanceof HTMLElement)) return;

  resetTooltip();
  tooltipBox.classList.add("hidden");
  tooltipBoxRect = null;

  if (requestAnimationID) {
    cancelAnimationFrame(requestAnimationID);
    requestAnimationID = null;
  }
});
