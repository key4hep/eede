// Selects, lays out, and renders objects for a given view, managing viewport positioning.
import {
  getCurrentVisObjects,
  saveCurrentScrollPosition,
  getSavedScrollPosition,
} from "../state/globals.js";
import {
  getViewportPosition,
  setViewportPosition,
  saveSize,
} from "../state/pixi-state.js";
import { possibleViews } from "./views/viewsDictionary.js";
import { checkEmptyObject } from "../lib/utils/empty-object.js";
import { showMessage } from "../lib/utils/messages.js";
import { renderObjects } from "./draw/render.js";
import { setRenderable } from "./draw/renderable.js";

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

export const drawView = async (view) => {
  const { selectorFunction, layoutFunction, positionFunction } =
    possibleViews[view];

  const allVisObjects = getCurrentVisObjects();

  const viewObjects = {};
  selectorFunction(allVisObjects, viewObjects);

  const isEmpty = checkEmptyObject(viewObjects);
  if (isEmpty) return null;

  await renderView(layoutFunction, viewObjects);

  const savedPosition = getSavedScrollPosition();
  if (savedPosition) {
    setViewportPosition(savedPosition.x, savedPosition.y);
  } else {
    positionFunction();
    saveCurrentScrollPosition(getViewportPosition());
  }

  setRenderable(viewObjects);
  return viewObjects;
};
