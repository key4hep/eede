import { currentObjects, currentEvent } from "../event-number.js";
import { copyObject } from "../lib/copy.js";
import { getVisible } from "../events.js";
import { draw } from "../draw.js";
import { views } from "./views-dictionary.js";
import { createPixi } from "../pixi/start.js";
import {
  mouseDown,
  mouseUp,
  mouseOut,
  mouseMove,
  onScroll,
} from "../events.js";

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

const drawView = async (view) => {
  paintButton(view);

  const { preFilterFunction, viewFunction, scrollFunction, filters } =
    views[view];

  const viewObjects = {};
  const viewCurrentObjects = {};
  const viewVisibleObjects = {};

  preFilterFunction(currentObjects, viewObjects);
  const { width, height } = viewFunction(viewObjects);
  const app = await createPixi(width, height);

  copyObject(viewObjects, viewCurrentObjects);

  const scrollIndex = getViewScrollIndex();

  if (scrollLocations[scrollIndex] === undefined) {
    const viewScrollLocation = scrollFunction();
    scrollLocations[scrollIndex] = viewScrollLocation;
  }

  scroll();
  draw(app, viewCurrentObjects);
  filters(viewObjects, viewCurrentObjects, viewVisibleObjects);

  // canvas.onmousedown = (event) => {
  //   mouseDown(event, viewVisibleObjects, dragTools);
  // };
  // canvas.onmouseup = (event) => {
  //   mouseUp(event, viewCurrentObjects, dragTools);
  // };
  // canvas.onmouseout = (event) => {
  //   mouseOut(event, dragTools);
  // };
  // canvas.onmousemove = (event) => {
  //   mouseMove(event, viewVisibleObjects, dragTools);
  // };
  // window.onscroll = () => {
  //   onScroll(viewCurrentObjects, viewVisibleObjects);
  // };
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
    drawView(key);
  };
  button.className = "view-button";
  buttons.push(button);
  viewOptions.appendChild(button);
}
