import { loadObjects } from "./types/load.js";
import { copyObject } from "./lib/copy.js";
import { jsonData, selectedObjectTypes } from "./main.js";
import { objectTypes } from "./types/objects.js";
import { drawView, getView, saveScrollLocation } from "./views/views.js";

const eventNumber = document.getElementById("selected-event");
const previousEvent = document.getElementById("previous-event");
const nextEvent = document.getElementById("next-event");

const currentEvent = {}; // only store event number
const eventCollection = {}; // store all events info (gradually store data for each event)
const currentObjects = {}; // store data (objects) for current event number

function updateEventNumber() {
  if (eventNumber.firstChild) {
    eventNumber.removeChild(eventNumber.firstChild);
  }
  eventNumber.appendChild(
    document.createTextNode(`Event: ${currentEvent.event}`)
  );
}

function loadSelectedEvent() {
  if (eventCollection[currentEvent.event] === undefined) {
    const objects = loadObjects(
      jsonData.data,
      currentEvent.event,
      selectedObjectTypes.types
    );

    eventCollection[currentEvent.event] = objects;

    for (const [key, value] of Object.entries(
      eventCollection[currentEvent.event].datatypes
    )) {
      const classType = objectTypes[key];
      const collection = value.collection;
      classType.setup(collection);
    }
    copyObject(objects, currentObjects);
  } else {
    copyObject(eventCollection[currentEvent.event], currentObjects);
  }
}

export function renderEvent(eventNumber) {
  saveScrollLocation();
  currentEvent.event = eventNumber;
  loadSelectedEvent();
  updateEventNumber();
  drawView(getView());
}

previousEvent.addEventListener("click", () => {
  const newEventNum = `${parseInt(currentEvent.event) - 1}`;
  renderEvent(newEventNum);
});
nextEvent.addEventListener("click", () => {
  const newEventNum = `${parseInt(currentEvent.event) + 1}`;
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

export { eventCollection, currentObjects, currentEvent };
