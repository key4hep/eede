import { getCurrentEventName } from "../../state/globals.js";

const eventNumberElem = document.getElementById("selected-event");

export function updateEventDisplay() {
  if (eventNumberElem.firstChild) {
    eventNumberElem.removeChild(eventNumberElem.firstChild);
  }
  eventNumberElem.appendChild(document.createTextNode(getCurrentEventName()));
}
