import { loadObjects } from "./types/load.js";
import { copyObject } from "./lib/copy.js";
import { canvas, jsonData, selectedObjectTypes } from "./main.js";
import { objectTypes } from "./types/objects.js";
import { drawCurrentView, saveScrollLocation } from "./views/views.js";
// import {
//   bits,
//   genStatus,
//   renderRangeParameters,
//   parametersRange,
//   renderGenSim,
// } from "./menu/filter/filter.js";

// const filters = document.getElementById("filters");
// const manipulationTools = document.getElementsByClassName("manipulation-tool");
const eventNumber = document.getElementById("selected-event");
const previousEvent = document.getElementById("previous-event");
const nextEvent = document.getElementById("next-event");

const currentEvent = {};

const eventCollection = {};
const currentObjects = {};

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
      classType.setup(collection, canvas);
    }
    copyObject(objects, currentObjects);
  } else {
    copyObject(eventCollection[currentEvent.event], currentObjects);
  }

  // --> menu/filtering stuff
  // for (const tool of manipulationTools) {
  //   tool.style.display = "flex";
  // }
  // const mcObjects = loadedObjects.datatypes["edm4hep::MCParticle"].collection;
  // genStatus.reset();
  // mcObjects.forEach((mcObject) => {
  //   genStatus.add(mcObject.generatorStatus);
  // });
  // genStatus.setCheckBoxes();
  // filters.replaceChildren();

  // renderRangeParameters(parametersRange);
  // renderGenSim(bits, genStatus);
}

export function renderEvent(eventNumber) {
  saveScrollLocation();
  currentEvent.event = eventNumber;
  loadSelectedEvent();
  updateEventNumber();
  drawCurrentView();
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

export { currentObjects, currentEvent };
