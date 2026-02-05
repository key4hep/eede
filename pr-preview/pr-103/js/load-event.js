import { loadObjects } from "./types/load.js";
import { copyObject } from "./lib/copy.js";
import { objectTypes } from "./types/objects.js";
import { drawView } from "./views/views.js";
import { getContainer } from "./draw/app.js";
import { getFileData,
         setCurrentEventIndex,
         getCurrentEventIndex,
         getCurrentEventNumber,
         getCurrentEventName,
         eventCollection,
         currentVisObjects,
         getEventNumbers,
         getCurrentView,
         saveCurrentScrollPosition } from "./globals.js";

function loadSelectedEvent() {
  const currentEventIndex = getCurrentEventIndex();
  if (eventCollection[currentEventIndex] === undefined) {
    const objects = loadObjects(getFileData(), getCurrentEventNumber());

    eventCollection[currentEventIndex] = objects;
    // console.log(`eventCollection[${currentEventIndex}]:`);
    // console.log(eventCollection[currentEventIndex]);

    for (const datatype in eventCollection[currentEventIndex].datatypes) {
      const classType = objectTypes[datatype];
      const collection = eventCollection[currentEventIndex].datatypes[datatype].collection;
      classType.setup(collection);
    }
    copyObject(objects, currentVisObjects);
  } else {
    copyObject(eventCollection[currentEventIndex], currentVisObjects);
  }
}

export function renderEvent(eventIndex) {
  setCurrentEventIndex(eventIndex);
  loadSelectedEvent();
  updateEventNumber();
  drawView(getCurrentView());
}

export function updateEventSelectorMenu() {
  const eventSelectorMenu = document.getElementById("event-selector-menu");
  eventSelectorMenu.replaceChildren();

  const eventNumbers = getEventNumbers();
  for (const [eventIndex, eventNumber] of eventNumbers.entries()) {
    const optionElementMenu = document.createElement("div");
    optionElementMenu.className = "event-option";
    optionElementMenu.appendChild(document.createTextNode(`Event ${eventNumber}`));
    eventSelectorMenu.appendChild(optionElementMenu);
    optionElementMenu.addEventListener("click", () => {
      saveCurrentScrollPosition(getContainer());
      renderEvent(eventIndex);
      eventSelectorMenu.style.display = "none";
    });
  }
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
  saveCurrentScrollPosition(getContainer());
  renderEvent(newEventNum);
});

nextEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getCurrentEventIndex();

  if ((currentEventIndex + 1) >= eventNumbers.length) {
    return;
  }

  const newEventNum = `${eventNumbers[currentEventIndex + 1]}`;
  saveCurrentScrollPosition(getContainer());
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

export { eventCollection };
