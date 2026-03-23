// Handles navigation between events and updates the event selector menu

import {
  getEventNumbers,
  getCurrentEventIndex,
  getCurrentEventName,
  getCurrentView,
  saveCurrentScrollPosition,
} from "../state/globals.js";
import { getViewportPosition } from "../state/pixi-state.js";
import { loadEvent } from "../loaders/loadEvent.js";
import { drawView, setRenderable } from "../viz/renderView.js";
import { possibleViews } from "../viz/views/viewsDictionary.js";
import {
  showViewInformation,
  hideViewInformation,
  updateViewInfoButton,
} from "./modals/information.js";
import {
  emptyViewMessage,
  hideEmptyViewMessage,
} from "../lib/utils/messages.js";
import { handleFilters } from "./filters/filter.js";
import { setupToggles } from "./toggle/toggle.js";
import { highlightViewButton } from "./view-selector.js";

const eventNumberElem = document.getElementById("selected-event");
const previousEvent = document.getElementById("previous-event");
const nextEvent = document.getElementById("next-event");

async function switchEvent(eventIndex) {
  saveCurrentScrollPosition(getViewportPosition());
  loadEvent(eventIndex);
  updateEventDisplay();

  const view = getCurrentView();
  highlightViewButton(view);
  const viewObjects = await drawView(view);
  if (viewObjects === null) {
    emptyViewMessage();
    hideViewInformation();
    return;
  }
  const { collections, description } = possibleViews[view];
  showViewInformation(view, description);
  updateViewInfoButton(view);
  hideEmptyViewMessage();
  handleFilters(viewObjects, collections, setRenderable);
  setupToggles(collections, viewObjects);
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

eventNumberElem.addEventListener("click", () => {
  const eventSelectorMenu = document.getElementById("event-selector-menu");
  if (eventSelectorMenu.style.display === "flex") {
    eventSelectorMenu.style.display = "none";
  } else {
    eventSelectorMenu.style.display = "flex";
  }
});

export function populateEventSelectorMenu() {
  const eventSelectorMenu = document.getElementById("event-selector-menu");
  eventSelectorMenu.replaceChildren();
  const eventNumbers = getEventNumbers();
  for (const [eventIndex, eventNumber] of eventNumbers.entries()) {
    const option = document.createElement("div");
    option.className = "event-option";
    option.appendChild(document.createTextNode(`Event ${eventNumber}`));
    eventSelectorMenu.appendChild(option);
    option.addEventListener("click", () => {
      switchEvent(eventIndex);
      eventSelectorMenu.style.display = "none";
    });
  }
}

export function updateEventDisplay() {
  if (eventNumberElem.firstChild) {
    eventNumberElem.removeChild(eventNumberElem.firstChild);
  }
  eventNumberElem.appendChild(document.createTextNode(getCurrentEventName()));
}
