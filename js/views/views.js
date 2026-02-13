import { copyObject } from "../lib/copy.js";
import { checkEmptyObject } from "../lib/empty-object.js";
import { possibleViews } from "./views-dictionary.js";
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
import {
  getCurrentVisObjects,
  setCurrentView,
  getCurrentView,
  saveCurrentScrollPosition,
  getSavedScrollPosition,
} from "../globals.js";

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

export function saveScrollPosition() {
  const container = getContainer();
  const { x, y } = getSavedScrollPosition();

  container.moveCenter(x, y);
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

  if (getSavedScrollPosition() === undefined) {
    scrollFunction(); // Sets new scroll position
    saveCurrentScrollPosition(getContainer()); // Saves current scroll position
  }
  saveScrollPosition();
  setRenderable(viewCurrentObjects);

  initFilters(
    { viewObjects, viewCurrentObjects },
    collections,
    reconnectFunction,
    {
      render,
      filterScroll: scrollFunction,
      originalScroll: saveScrollPosition,
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
    saveCurrentScrollPosition(getContainer());
    setCurrentView(key);
    drawView(getCurrentView());
  };
  button.className = "view-button";
  buttons.push(button);
  viewOptions.appendChild(button);
}
