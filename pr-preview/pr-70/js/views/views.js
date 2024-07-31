import { currentObjects, currentEvent } from "../event-number.js";
import { copyObject } from "../lib/copy.js";
import { checkEmptyObject } from "../lib/empty-object.js";
import { views } from "./views-dictionary.js";
import { emptyViewMessage, hideEmptyViewMessage } from "../lib/messages.js";
import { showViewInformation, hideViewInformation } from "../information.js";
import { renderObjects } from "../draw/render.js";
import { getContainer, saveSize } from "../draw/app.js";
import { setRenderable } from "../draw/renderable.js";
import { initFilters } from "../filters/filter.js";

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
}

function setInfoButtonName(view) {
  const button = document.getElementById("view-information-button");
  button.innerText = view;
}

// const addTask = (() => {
//   let pending = Promise.resolve();

//   const run = async (view) => {
//     try {
//       await pending;
//     } finally {
//       return drawView(view);
//     }
//   };

//   return (view) => (pending = run(view));
// })();

const drawView = async (view) => {
  const {
    preFilterFunction,
    viewFunction,
    scrollFunction,
    collections,
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

  const render = async (objects) => {
    const [width, height] = viewFunction(objects);
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

  initFilters({ viewObjects, viewCurrentObjects }, collections, {
    render,
    filterScroll: scrollFunction,
    originalScroll: scroll,
    setRenderable,
  });
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
  drawView(currentView.view);
};

const buttons = [];

for (const key in views) {
  const button = document.createElement("button");
  button.appendChild(document.createTextNode(key));
  button.onclick = () => {
    saveScrollLocation();
    setView(key);
    drawCurrentView(currentView.view);
  };
  button.className = "view-button";
  buttons.push(button);
  viewOptions.appendChild(button);
}
