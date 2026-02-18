import { copyObject } from "../lib/copy.js";
import { checkEmptyObject } from "../lib/empty-object.js";
import { possibleViews } from "./views-dictionary.js";
import {
  emptyViewMessage,
  hideEmptyViewMessage,
  showMessage,
} from "../lib/messages.js";
import {
  showViewInformation,
  hideViewInformation,
} from "../modals/information.js";
import { renderObjects } from "../viz/draw/render.js";
import {
  getViewportPosition,
  setViewportPosition,
  saveSize,
} from "../viz/draw/app.js";
import { setRenderable } from "../viz/draw/renderable.js";
import { initFilters } from "../filters/filter.js";
import { setupToggles } from "../toggle/toggle.js";
import { getCurrentVisObjects } from "../state/event.js";
import {
  setCurrentView,
  getCurrentView,
  saveCurrentScrollPosition,
  getSavedScrollPosition,
} from "../state/view.js";

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

function paintButton(view) {
  for (const button of buttons) {
    if (button.innerText === view) {
      button.style.backgroundColor = "#c5c5c5";
    } else {
      button.style.backgroundColor = "#f1f1f1";
    }
  }
}

export function restoreScrollPosition() {
  const { x, y } = getSavedScrollPosition();
  setViewportPosition(x, y);
}

function setInfoButtonName(view) {
  const button = document.getElementById("view-information-button");
  button.innerText = view;
}

async function renderView(viewFunction, objects) {
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

  width = Math.max(width, window.innerWidth);
  height = Math.max(height, window.innerHeight);
  saveSize(width, height);
  await renderObjects(objects);
}

export const drawView = async (view) => {
  const {
    preFilterFunction,
    viewFunction,
    scrollFunction,
    collections,
    description,
    reconnectFunction,
  } = possibleViews[view];

  const allVisObjects = getCurrentVisObjects();

  const viewObjects = {};
  preFilterFunction(allVisObjects, viewObjects);
  paintButton(view);
  const isEmpty = checkEmptyObject(viewObjects);

  if (isEmpty) {
    emptyViewMessage();
    hideViewInformation();
    return;
  }

  showViewInformation(view, description);
  setInfoButtonName(getCurrentView());
  hideEmptyViewMessage();

  const viewCurrentObjects = {};
  copyObject(viewObjects, viewCurrentObjects);

  const render = (objects) => renderView(viewFunction, objects);

  await render(viewCurrentObjects);

  const savedPosition = getSavedScrollPosition();
  if (savedPosition) {
    setViewportPosition(savedPosition.x, savedPosition.y);
  } else {
    scrollFunction();
    saveCurrentScrollPosition(getViewportPosition());
  }
  setRenderable(viewCurrentObjects);

  initFilters(
    { viewObjects, viewCurrentObjects },
    collections,
    reconnectFunction,
    {
      render,
      filterScroll: scrollFunction,
      originalScroll: restoreScrollPosition,
      setRenderable,
    },
  );

  setupToggles(collections, viewCurrentObjects);
};

const buttons = [];

for (const key in possibleViews) {
  const button = document.createElement("button");
  button.appendChild(document.createTextNode(key));
  button.onclick = () => {
    saveCurrentScrollPosition(getViewportPosition());
    setCurrentView(key);
    drawView(getCurrentView());
  };
  button.className = "view-button";
  buttons.push(button);
  viewOptions.appendChild(button);
}
