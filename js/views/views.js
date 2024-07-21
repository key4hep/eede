import { currentObjects, currentEvent } from "../event-number.js";
import { copyObject } from "../lib/copy.js";
import { checkEmptyObject } from "../lib/empty-object.js";
import { views } from "./views-dictionary.js";
import { emptyViewMessage, hideEmptyViewMessage } from "../lib/messages.js";
import { showViewInformation, hideViewInformation } from "../information.js";
import { renderObjects } from "../draw/render.js";
import { getContainer, setContainerSize } from "../draw/app.js";

const currentView = {};

const viewOptions = document.getElementById("view-selector");

const scrollLocations = {};

function paintButton(view) {
  for (const button of buttons) {
    if (button.innerText === view) {
      button.style.backgroundColor = "#c5c5c5";
    } else {
      button.style.backgroundColor = "#f1f1f1";
    }
  }
}

function getViewScrollIndex() {
  return `${currentEvent.event}-${getView()}`;
}

function scroll() {
  const index = getViewScrollIndex();
  window.scrollTo(scrollLocations[index].x, scrollLocations[index].y);
}

function setInfoButtonName(view) {
  const button = document.getElementById("view-information-button");
  button.innerText = view;
}

const drawView = async (view) => {
  const container = getContainer();
  container.removeChildren();

  const {
    preFilterFunction,
    viewFunction,
    scrollFunction,
    filters,
    description,
  } = views[view];

  const viewObjects = {};
  preFilterFunction(currentObjects, viewObjects);
  paintButton(view);
  const isEmpty = checkEmptyObject(viewObjects);

  if (isEmpty) {
    emptyViewMessage();
    hideViewInformation();
    return;
  }

  showViewInformation(view, description);
  setInfoButtonName(getView());
  hideEmptyViewMessage();

  const viewCurrentObjects = {};
  copyObject(viewObjects, viewCurrentObjects);

  const [width, height] = viewFunction(viewObjects);
  setContainerSize(width, height);

  await renderObjects(viewObjects);
  scrollFunction();
  // const scrollIndex = getViewScrollIndex();

  // if (scrollLocations[scrollIndex] === undefined) {
  //   const viewScrollLocation = scrollFunction();
  //   scrollLocations[scrollIndex] = viewScrollLocation;
  // }

  // filters(viewObjects, viewCurrentObjects, viewVisibleObjects);
};

export function saveScrollLocation() {
  const index = getViewScrollIndex();
  if (scrollLocations[index] === undefined) return;
  scrollLocations[index] = {
    x: window.scrollX,
    y: window.scrollY,
  };
}

export const setView = (view) => {
  currentView.view = view;
};

export const getView = () => {
  return currentView.view;
};

export const drawCurrentView = async () => {
  await drawView(currentView.view);
};

const buttons = [];

for (const key in views) {
  const button = document.createElement("button");
  button.appendChild(document.createTextNode(key));
  button.onclick = async () => {
    await drawView(key);
  };
  button.className = "view-button";
  buttons.push(button);
  viewOptions.appendChild(button);
}
