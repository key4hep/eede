/*
 * Datatypes
 */
import { supportedEDM4hepTypes } from "../../model/datatypes.js";

export function getSupportedEDM4hepTypes(schemaVersion) {
  if (typeof schemaVersion === "undefined") {
    return supportedEDM4hepTypes[getCurrentSchemaVersion()];
  }

  return supportedEDM4hepTypes[schemaVersion];
}

let currentSchemaVersion = null;

export function setCurrentSchemaVersion(schemaVersion) {
  currentSchemaVersion = schemaVersion;
}

export function getCurrentSchemaVersion() {
  return currentSchemaVersion;
}

export function schemaWithLinks() {
  if (currentSchemaVersion === null) {
    return false;
  }

  if (currentSchemaVersion === "old") {
    return false;
  }
  if (currentSchemaVersion == 1) {
    return false;
  }

  return true;
}

/*
 * File
 */
const fileData = {
  json: null,
  name: null,
};

export function setFileName(fileName) {
  fileData.name = fileName;
}

export function getFileName() {
  return fileData.name;
}

export function setFileData(jsonData) {
  fileData.json = jsonData;

  const eventNumbers = Object.keys(fileData.json).map((event) =>
    parseInt(event.replace("Event ", "")),
  );

  if (eventNumbers.length === 0) {
    return {
      err: true,
      mgs: "ERROR: No events found in the provided EDM4hep JSON file!",
    };
  }

  setEventNumbers(eventNumbers);

  return { err: false };
}

export function getFileData() {
  return fileData.json;
}

/*
 * Event
 */
export const eventCollection = {}; // store all events info (gradually store data for each event)

let eventNumbers = null;

export function getEventNumbers() {
  return eventNumbers;
}

export function setEventNumbers(numbers) {
  eventNumbers = numbers;
}

export function getEventIndex(eventNumber) {
  return eventNumbers.findIndex((elem) => elem === Number(eventNumber));
}

let currentEventIndex = 0;

export function setCurrentEventIndex(index) {
  currentEventIndex = index;
}

export function getCurrentEventIndex() {
  return currentEventIndex;
}

export function getCurrentEventNumber() {
  return eventNumbers[currentEventIndex];
}

export function getCurrentEventName() {
  return `Event ${getCurrentEventNumber()}`;
}

/*
 * Visual Objects
 */
export const currentVisObjects = {}; // store data (objects) for current event number

export function getCurrentVisObjects() {
  return currentVisObjects;
}

/*
 * View
 */
const scrollPositions = {};

let currentView = null;

export function setCurrentView(viewName) {
  currentView = viewName;
}

export function getCurrentView() {
  return currentView;
}

function getViewScrollIndex() {
  return `${getCurrentEventIndex()}-${getCurrentView()}`;
}

export function saveCurrentScrollPosition(position) {
  const scrollIndex = getViewScrollIndex();

  if (position === undefined) {
    return;
  }

  if (position === null) {
    return;
  }

  scrollPositions[scrollIndex] = {
    x: position.x,
    y: position.y,
  };
}

export function getSavedScrollPosition() {
  const scrollIndex = getViewScrollIndex();
  return scrollPositions[scrollIndex];
}

export function clearScrollPositions() {
  Object.keys(scrollPositions).forEach((key) => {
    delete scrollPositions[key];
  });
}

/*
 * Clearings
 */
export function clearAllEventData() {
  currentSchemaVersion = null;
  eventNumbers = null;
  currentEventIndex = 0;
  currentView = null;

  Object.keys(eventCollection).forEach((key) => {
    delete eventCollection[key];
  });

  clearScrollPositions();
}
