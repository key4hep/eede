import { loadObjects } from "../types/load.js";
import { copyObject } from "../lib/copy.js";
import {
  loadedObjects,
  currentObjects,
  visibleObjects,
  canvas,
  ctx,
} from "../main.js";
import { getVisible } from "../events.js";
import {
  bits,
  genStatus,
  renderRangeParameters,
  parametersRange,
  renderGenSim,
} from "./filter/filter.js";
import { drawAll } from "../draw.js";
import { objectTypes } from "../types/objects.js";
import { jsonData, selectedObjectTypes } from "../main.js";

const filters = document.getElementById("filters");
const eventSwitcher = document.getElementById("event-switcher");
const eventNumber = document.getElementById("selected-event");
const previousEvent = document.getElementById("previous-event");
const nextEvent = document.getElementById("next-event");
const manipulationTools = document.getElementsByClassName("manipulation-tool");

let currentEvent;

function updateEventNumber(newEventNumber) {
  if (eventNumber.firstChild) {
    eventNumber.removeChild(eventNumber.firstChild);
  }
  eventNumber.appendChild(document.createTextNode(`Event: ${newEventNumber}`));
}

function start(currentObjects, visibleObjects) {
  for (const [key, value] of Object.entries(currentObjects)) {
    const classType = objectTypes[key];
    const collection = value.collection;
    classType.setup(collection, canvas);
  }

  drawAll(ctx, currentObjects);

  getVisible(currentObjects, visibleObjects);
}

export function renderEvent(eventNumber) {
  const data = jsonData.data[`Event ${eventNumber}`];

  if (data === undefined) {
    return;
  } else {
    currentEvent = eventNumber;
    updateEventNumber(eventNumber);
    loadSelectedEvent(jsonData, selectedObjectTypes.types, eventNumber);
  }
}

export function showEventSwitcher(initialValue) {
  eventSwitcher.style.display = "flex";
  updateEventNumber(initialValue);
  currentEvent = initialValue;
}

export function loadSelectedEvent() {
  const objects = loadObjects(
    jsonData.data,
    currentEvent,
    selectedObjectTypes.types
  );

  copyObject(objects, loadedObjects);
  copyObject(objects, currentObjects);

  const length = Object.values(loadedObjects)
    .map((obj) => obj.collection.length)
    .reduce((a, b) => a + b, 0);

  if (length === 0) {
    errorMsg("Event does not contain any objects!");
    return;
  }

  start(currentObjects, visibleObjects);
  window.scroll((canvas.width - window.innerWidth) / 2, 0);

  for (const tool of manipulationTools) {
    tool.style.display = "flex";
  }

  const mcObjects = loadedObjects["edm4hep::MCParticle"].collection;
  genStatus.reset();
  mcObjects.forEach((mcObject) => {
    genStatus.add(mcObject.generatorStatus);
  });
  genStatus.setCheckBoxes();
  filters.replaceChildren();

  renderRangeParameters(parametersRange);
  renderGenSim(bits, genStatus);
}

previousEvent.addEventListener("click", () => {
  const newEventNum = `${parseInt(currentEvent) - 1}`;
  renderEvent(newEventNum);
});
nextEvent.addEventListener("click", () => {
  const newEventNum = `${parseInt(currentEvent) + 1}`;
  renderEvent(newEventNum);
});
eventNumber.addEventListener("click", () => {
  const eventSelectorMenu = document.getElementById("event-selector-menu");
  if (eventSelectorMenu.style.display === "flex") {
    eventSelectorMenu.style.display = "none";
  } else {
    eventSelectorMenu.style.display = "flex";
  }
});
