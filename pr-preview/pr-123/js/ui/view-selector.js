// Handles navigation between different visualization views

// Globals
import { setCurrentView, saveCurrentScrollPosition } from "../state/globals.js";
import { getViewportPosition } from "../state/pixi-state.js";

// Visualization code
import { possibleViews } from "../viz/views/viewsDictionary.js";

// UI logic
import { activateView } from "./activate-view.js";

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
  button.onclick = async () => {
    saveCurrentScrollPosition(getViewportPosition());
    setCurrentView(key);
    await activateView();
  };
  button.className = "view-button";
  viewOptions.appendChild(button);
}
