import { possibleViews } from "../viz/views/viewsDictionary.js";
import {
  setCurrentView,
  getCurrentView,
  saveCurrentScrollPosition,
} from "../state/globals.js";
import { getViewportPosition } from "../state/pixi-state.js";
import { drawView } from "../viz/renderView.js";

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

for (const key in possibleViews) {
  const button = document.createElement("button");
  button.appendChild(document.createTextNode(key));
  button.onclick = () => {
    saveCurrentScrollPosition(getViewportPosition());
    setCurrentView(key);
    drawView(getCurrentView());
  };
  button.className = "view-button";
  viewOptions.appendChild(button);
}
