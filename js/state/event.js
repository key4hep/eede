import { clearScrollPositions } from "./view.js";

/*
 * Event
 */
export const eventCollection = {}; // store all events info (gradually store data for each event)

export function getEventNumbers() {
  const eventNumbersString = window.sessionStorage.getItem("event-numbers");
  return JSON.parse(eventNumbersString);
}

export function setEventNumbers(eventNumbers) {
  window.sessionStorage.setItem("event-numbers", JSON.stringify(eventNumbers));
}

export function getEventIndex(eventNumber) {
  const eventNumbers = getEventNumbers();
  return eventNumbers.findIndex((elem) => elem === Number(eventNumber));
}

export function setCurrentEventIndex(index) {
  return Number(window.sessionStorage.setItem("current-event-index", index));
}

export function getCurrentEventIndex() {
  return Number(window.sessionStorage.getItem("current-event-index"));
}

export function getCurrentEventNumber() {
  const currentEventIndex = getCurrentEventIndex();
  const eventNumbers = getEventNumbers();
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
 * Clearings
 */
export function clearAllEventData() {
  window.sessionStorage.clear();

  Object.keys(eventCollection).forEach((key) => {
    delete eventCollection[key];
  });

  clearScrollPositions();
}
