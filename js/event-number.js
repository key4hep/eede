import { loadObjects } from "./types/load.js";
import { copyObject } from "./lib/copy.js";
import { jsonData, selectedObjectTypes } from "./main.js";
import { objectTypes } from "./types/objects.js";
import { drawView, getView, saveScrollLocation } from "./views/views.js";

const currentEvent = {
  number: null
}; // only store event number
const eventCollection = {}; // store all events info (gradually store data for each event)
const currentObjects = {}; // store data (objects) for current event number

function loadSelectedEvent() {
  if (eventCollection[currentEvent.number] === undefined) {
    const objects = loadObjects(
      jsonData.data,
      currentEvent.number,
      selectedObjectTypes.types
    );

    eventCollection[currentEvent.number] = objects;

    for (const datatype in eventCollection[currentEvent.number].datatypes) {
      const classType = objectTypes[datatype];
      const collection = eventCollection[currentEvent.number].datatypes[datatype].collection;
      classType.setup(collection);
    }
    copyObject(objects, currentObjects);
  } else {
    copyObject(eventCollection[currentEvent.number], currentObjects);
  }
}

export function renderEvent(eventNumber) {
  saveScrollLocation();
  currentEvent.number = eventNumber;
  loadSelectedEvent();
  updateEventNumber();
  drawView(getView());
}

// Page updates
const eventNumber = document.getElementById("selected-event");
const previousEvent = document.getElementById("previous-event");
const nextEvent = document.getElementById("next-event");

function updateEventNumber() {
  if (eventNumber.firstChild) {
    eventNumber.removeChild(eventNumber.firstChild);
  }
  eventNumber.appendChild(
    document.createTextNode(`Event: ${currentEvent.number}`)
  );
}

function getEventNumbers() {
  const eventNumbersString = window.sessionStorage.getItem('event-numbers');
  return JSON.parse('[' + eventNumbersString + ']');
}

function getEventIndex(currentEventNumber) {
  const eventNumbers = getEventNumbers();
  return eventNumbers.findIndex((elem) => elem === Number(currentEventNumber));
}

previousEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getEventIndex(currentEvent.number);

  if (currentEventIndex <= 0) {
    return;
  }

  const newEventNum = `${eventNumbers[currentEventIndex - 1]}`;
  renderEvent(newEventNum);
});

nextEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getEventIndex(currentEvent.number);

  if ((currentEventIndex + 1) >= eventNumbers.length) {
    return;
  }

  const newEventNum = `${eventNumbers[currentEventIndex + 1]}`;
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
