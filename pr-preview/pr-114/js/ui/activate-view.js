// Renders the current view with its respective UI

// Globals
import { getCurrentView } from "../state/globals.js";

// Utils
import {
  emptyViewMessage,
  hideEmptyViewMessage,
} from "../lib/utils/messages.js";

// Visualization code
import { drawView } from "../viz/renderView.js";
import { setRenderable } from "../viz/draw/renderable.js";
import { possibleViews } from "../viz/views/viewsDictionary.js";

// UI logic
import { handleFilters } from "./filters/handleFilters.js";
import { setupToggles } from "./toggle/toggle.js";
import {
  showViewInformation,
  hideViewInformation,
  updateViewInfoButton,
} from "./modals/information.js";

export async function activateView() {
  const view = getCurrentView();
  const viewOptions = document.getElementById("view-selector");
  const buttons = viewOptions.querySelectorAll(".view-button");

  for (const button of buttons) {
    if (button.innerText === view) {
      button.style.backgroundColor = "#c5c5c5";
    } else {
      button.style.backgroundColor = "#f1f1f1";
    }
  }

  const viewObjects = await drawView(view);

  if (viewObjects === null) {
    emptyViewMessage();
    hideViewInformation();
    return;
  }

  const { collections, description } = possibleViews[view];

  showViewInformation(view, description);
  updateViewInfoButton(view);
  hideEmptyViewMessage();
  handleFilters(viewObjects, collections, setRenderable);
  setupToggles(collections, viewObjects);
}
