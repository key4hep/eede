import { loadObjects } from "./types/load.js";
import { copyObject } from "./lib/copy.js";
import { objectTypes } from "./types/objects.js";
import { drawView } from "./views/views.js";
import { getContainer } from "./draw/app.js";
import { supportedEDM4hepTypes } from "./configuration.js";
import { getFileData,
         setCurrentEventIndex,
         getCurrentEventIndex,
         getCurrentEventName,
         getEventNumbers,
         getCurrentView,
         saveCurrentScrollPosition } from "./globals.js";

const eventCollection = {}; // store all events info (gradually store data for each event)
const currentObjects = {}; // store data (objects) for current event number

function loadSelectedEvent() {
  const currentEventIndex = getCurrentEventIndex();
  if (eventCollection[currentEventIndex] === undefined) {
    const objects = loadObjects(
      getFileData(),
      currentEventIndex,
      supportedEDM4hepTypes.types
    );

    eventCollection[currentEventIndex] = objects;

    for (const datatype in eventCollection[currentEventIndex].datatypes) {
      const classType = objectTypes[datatype];
      const collection = eventCollection[currentEventIndex].datatypes[datatype].collection;
      classType.setup(collection);
    }
    copyObject(objects, currentObjects);
  } else {
    copyObject(eventCollection[currentEventIndex], currentObjects);
  }
}

export function renderEvent(eventIndex) {
  saveCurrentScrollPosition(getContainer());
  setCurrentEventIndex(eventIndex);
  loadSelectedEvent();
  updateEventNumber();
  drawView(getCurrentView());
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
    document.createTextNode(getCurrentEventName())
  );
}

previousEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getCurrentEventIndex();

  if (currentEventIndex <= 0) {
    return;
  }

  const newEventNum = `${eventNumbers[currentEventIndex - 1]}`;
  renderEvent(newEventNum);
});

nextEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getCurrentEventIndex();

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

export { eventCollection, currentObjects };
