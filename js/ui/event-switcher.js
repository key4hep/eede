// Handles navigation between the different events

// Globals
import {
  getEventNumbers,
  getCurrentEventIndex,
  saveCurrentScrollPosition,
} from "../state/globals.js";
import { getViewportPosition } from "../state/pixi-state.js";

// Loader
import { loadEvent } from "../loaders/loadEvent.js";

// Utils
import { updateEventDisplay } from "../lib/utils/event-display.js";

// UI logic
import { activateView } from "./activate-view.js";

const previousEvent = document.getElementById("previous-event");
const nextEvent = document.getElementById("next-event");

export async function switchEvent(eventIndex) {
  saveCurrentScrollPosition(getViewportPosition());
  loadEvent(eventIndex);
  updateEventDisplay();

  await activateView();
}

previousEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getCurrentEventIndex();

  if (currentEventIndex <= 0) {
    return;
  }

  const newEventNum = `${eventNumbers[currentEventIndex - 1]}`;
  switchEvent(newEventNum);
});

nextEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getCurrentEventIndex();

  if (currentEventIndex + 1 >= eventNumbers.length) {
    return;
  }

  const newEventNum = `${eventNumbers[currentEventIndex + 1]}`;
  switchEvent(newEventNum);
});

document.getElementById("selected-event").addEventListener("click", () => {
  const eventSelectorMenu = document.getElementById("event-selector-menu");
  if (eventSelectorMenu.style.display === "flex") {
    eventSelectorMenu.style.display = "none";
  } else {
    eventSelectorMenu.style.display = "flex";
  }
});
