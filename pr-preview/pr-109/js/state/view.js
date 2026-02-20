import { getCurrentEventIndex } from "./event.js";

const scrollPositions = {};

export function setCurrentView(viewName) {
  window.sessionStorage.setItem("current-view", viewName);
}

export function getCurrentView() {
  return window.sessionStorage.getItem("current-view");
}

function getViewScrollIndex() {
  return `${getCurrentEventIndex()}-${getCurrentView()}`;
}

export function saveCurrentScrollPosition(position) {
  const scrollIndex = getViewScrollIndex();

  if (position === undefined) {
    return;
  }

  if (position === null) {
    return;
  }

  scrollPositions[scrollIndex] = {
    x: position.x,
    y: position.y,
  };
}

export function getSavedScrollPosition() {
  const scrollIndex = getViewScrollIndex();
  return scrollPositions[scrollIndex];
}

export function clearScrollPositions() {
  Object.keys(scrollPositions).forEach((key) => {
    delete scrollPositions[key];
  });
}
