import { currentObjects, currentEvent } from "../event-number.js";
import { copyObject } from "../lib/copy.js";
import { checkEmptyObject } from "../lib/empty-object.js";
import { views } from "./views-dictionary.js";
import { emptyViewMessage, hideEmptyViewMessage } from "../lib/messages.js";
import { showViewInformation, hideViewInformation } from "../information.js";
import { renderObjects } from "../draw/render.js";
import { getContainer, saveSize } from "../draw/app.js";
import { setRenderable } from "../draw/renderable.js";

const currentView = {};

const viewOptions = document.getElementById("view-selector");

export const scrollLocations = {};

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

export function scroll() {
  const container = getContainer();
  const index = getViewScrollIndex();
  const { x, y } = scrollLocations[index];

  container.position.set(x, y);
}

function setInfoButtonName(view) {
  const button = document.getElementById("view-information-button");
  button.innerText = view;
}

const addTask = (() => {
  let pending = Promise.resolve();

  const run = async (view) => {
    try {
      await pending;
    } finally {
      return drawView(view);
    }
  };

  return (view) => (pending = run(view));
})();

const drawView = async (view) => {
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

  let [width, height] = viewFunction(viewObjects);
  if (width < window.innerWidth) {
    width = window.innerWidth;
  }
  if (height < window.innerHeight) {
    height = window.innerHeight;
  }
  saveSize(width, height);

  const scrollIndex = getViewScrollIndex();
  if (scrollLocations[scrollIndex] === undefined) {
    const viewScrollLocation = scrollFunction();
    scrollLocations[scrollIndex] = viewScrollLocation;
  }

  await renderObjects(viewObjects);
  scroll();
  setRenderable(viewCurrentObjects);

  filters(viewObjects, viewCurrentObjects);
};

export function saveScrollLocation() {
  const index = getViewScrollIndex();
  if (scrollLocations[index] === undefined) return;
  const container = getContainer();
  scrollLocations[index] = {
    x: container.x,
    y: container.y,
  };
}

export const setView = (view) => {
  currentView.view = view;
};

export const getView = () => {
  return currentView.view;
};

export const drawCurrentView = () => {
  addTask(currentView.view);
};

const buttons = [];

for (const key in views) {
  const button = document.createElement("button");
  button.appendChild(document.createTextNode(key));
  button.onclick = () => {
    saveScrollLocation();
    setView(key);
    addTask(key);
  };
  button.className = "view-button";
  buttons.push(button);
  viewOptions.appendChild(button);
}
