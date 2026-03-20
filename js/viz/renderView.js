import {
  setCurrentEventIndex,
  getCurrentEventIndex,
  getCurrentEventNumber,
  getCurrentEventName,
  getCurrentView,
  eventCollection,
  currentVisObjects,
  getCurrentVisObjects,
  saveCurrentScrollPosition,
  getSavedScrollPosition,
  getFileData,
} from "../state/globals.js";
import {
  getViewportPosition,
  setViewportPosition,
  saveSize,
} from "../state/pixi-state.js";
import { possibleViews } from "./views/viewsDictionary.js";
import { loadObjects } from "../loaders/load.js";
import { objectTypes } from "../lib/constants/objectTypes.js";
import { copyObject } from "../lib/utils/copy.js";
import { checkEmptyObject } from "../lib/utils/empty-object.js";
import {
  emptyViewMessage,
  hideEmptyViewMessage,
  showMessage,
} from "../lib/utils/messages.js";
import {
  showViewInformation,
  hideViewInformation,
} from "../ui/modals/information.js";
import { renderObjects } from "./draw/render.js";
import { setRenderable } from "./draw/renderable.js";
import { handleFilters } from "../ui/filters/filter.js";
import { setupToggles } from "../ui/toggle/toggle.js";

const eventNumberElem = document.getElementById("selected-event");

async function renderView(layoutFunction, objects) {
  const empty = checkEmptyObject(objects);

  if (empty) {
    showMessage("No objects satisfy the filter options");
    return;
  }

  let [width, height] = layoutFunction(objects);
  if (width === 0 && height === 0) {
    showMessage("No objects satisfy the filter options");
    return;
  }

  width = Math.max(width, window.innerWidth);
  height = Math.max(height, window.innerHeight);
  saveSize(width, height);
  await renderObjects(objects);
}

export function renderEvent(eventIndex) {
  setCurrentEventIndex(eventIndex);

  // load selected event
  const currentEventIndex = getCurrentEventIndex();
  if (eventCollection[currentEventIndex] === undefined) {
    const objects = loadObjects(getFileData(), getCurrentEventNumber());

    eventCollection[currentEventIndex] = objects;

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

  // update event number
  if (eventNumberElem.firstChild) {
    eventNumberElem.removeChild(eventNumberElem.firstChild);
  }
  eventNumberElem.appendChild(document.createTextNode(getCurrentEventName()));

  drawView(getCurrentView());
}

export const drawView = async (view) => {
  const {
    selectorFunction,
    layoutFunction,
    positionFunction,
    collections,
    description,
  } = possibleViews[view];

  const allVisObjects = getCurrentVisObjects();

  const viewObjects = {};
  selectorFunction(allVisObjects, viewObjects);

  // paint buttons
  const buttons = document.querySelectorAll("#view-selector .view-button");
  for (const button of buttons) {
    if (button.innerText === view) {
      button.style.backgroundColor = "#c5c5c5";
    } else {
      button.style.backgroundColor = "#f1f1f1";
    }
  }

  const isEmpty = checkEmptyObject(viewObjects);

  if (isEmpty) {
    emptyViewMessage();
    hideViewInformation();
    return;
  }

  showViewInformation(view, description);

  // set info button name
  const button = document.getElementById("view-information-button");
  button.innerText = getCurrentView();

  hideEmptyViewMessage();

  await renderView(layoutFunction, viewObjects);

  const savedPosition = getSavedScrollPosition();
  if (savedPosition) {
    setViewportPosition(savedPosition.x, savedPosition.y);
  } else {
    positionFunction();
    saveCurrentScrollPosition(getViewportPosition());
  }

  setRenderable(viewObjects);
  handleFilters(viewObjects, collections, setRenderable);
  setupToggles(collections, viewObjects);
};
