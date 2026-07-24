import {
  setCurrentEventIndex,
  getCurrentEventIndex,
  getCurrentEventNumber,
  eventCollection,
  currentVisObjects,
  getFileData,
} from "../state/globals.js";
import { formatEventData } from "./handleSchema.js";
import { objectTypes } from "../lib/constants/objectTypes.js";
import { copyObject } from "../lib/utils/copy.js";

export function loadEvent(eventIndex) {
  setCurrentEventIndex(eventIndex);

  const currentEventIndex = getCurrentEventIndex();

  if (eventCollection[currentEventIndex] === undefined) {
    // Retrieve an event by its index
    const objects = formatEventData(getFileData(), getCurrentEventNumber());

    // Cache parsed data in eventCollection variable
    eventCollection[currentEventIndex] = objects;

    // Run setup based on schema version
    for (const datatype in eventCollection[currentEventIndex].datatypes) {
      const classType = objectTypes[datatype];
      const collection =
        eventCollection[currentEventIndex].datatypes[datatype].collection;
      classType.setup(collection);
    }
    copyObject(objects, currentVisObjects);
  } else {
    copyObject(eventCollection[currentEventIndex], currentVisObjects);
  }
}
