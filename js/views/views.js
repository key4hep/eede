import { currentObjects, currentEvent } from "../event-number.js";
import { copyObject } from "../lib/copy.js";
import { checkEmptyObject } from "../lib/empty-object.js";
import { views } from "./views-dictionary.js";
import {
  emptyViewMessage,
  hideEmptyViewMessage,
  showMessage,
} from "../lib/messages.js";
import { showViewInformation, hideViewInformation } from "../information.js";
import { renderObjects } from "../draw/render.js";
import { getContainer, saveSize } from "../draw/app.js";
import { setRenderable } from "../draw/renderable.js";
import { initFilters } from "../filters/filter.js";
import { setupToggles } from "../toggle/toggle.js";
import { setScrollBarsPosition } from "../draw/scroll.js";

const currentView = {};

const viewOptions = document.getElementById("view-selector");
const openViewsButton = document.getElementById("open-views");
const closeViewsButton = document.getElementById("close-views");

openViewsButton.addEventListener("click", () => {
  viewOptions.style.display = "flex";
  openViewsButton.style.display = "none";
  closeViewsButton.style.display = "block";
});

closeViewsButton.addEventListener("click", () => {
  viewOptions.style.display = "none";
  openViewsButton.style.display = "block";
  closeViewsButton.style.display = "none";
});

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
  setScrollBarsPosition();
}

function setInfoButtonName(view) {
  const button = document.getElementById("view-information-button");
  button.innerText = view;
}

export const drawView = async (view) => {
  const {
    preFilterFunction,
    viewFunction,
    scrollFunction,
    collections,
    description,
    reconnectFunction,
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

  const render = async (objects) => {
    const empty = checkEmptyObject(objects);

    if (empty) {
      showMessage("No objects satisfy the filter options");
      return;
    }

    let [width, height] = viewFunction(objects);
    if (width === 0 && height === 0) {
      showMessage("No objects satisfy the filter options");
      return;
    }

    if (width < window.innerWidth) {
      width = window.innerWidth;
    }
    if (height < window.innerHeight) {
      height = window.innerHeight;
    }
    saveSize(width, height);
    await renderObjects(objects);
  };

  await render(viewCurrentObjects);

  const scrollIndex = getViewScrollIndex();
  if (scrollLocations[scrollIndex] === undefined) {
    const viewScrollLocation = scrollFunction();
    scrollLocations[scrollIndex] = viewScrollLocation;
  }
  scroll();
  setRenderable(viewCurrentObjects);

  initFilters(
    { viewObjects, viewCurrentObjects },
    collections,
    reconnectFunction,
    {
      render,
      filterScroll: scrollFunction,
      originalScroll: scroll,
      setRenderable,
    }
  );

  setupToggles(collections, viewCurrentObjects);
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

const buttons = [];

for (const key in views) {
  const button = document.createElement("button");
  button.appendChild(document.createTextNode(key));
  button.onclick = () => {
    saveScrollLocation();
    setView(key);
    drawView(getView());
  };
  button.className = "view-button";
  buttons.push(button);
  viewOptions.appendChild(button);
}
