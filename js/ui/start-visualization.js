// Handles the click on "visualize" button

// Globals
import {
  getFileData,
  getEventNumbers,
  getCurrentView,
  getFileName,
} from "../state/globals.js";
import { startPixi, isPixiRunning } from "../state/pixi-state.js";

// Utils
import { errorMsg } from "../lib/utils/messages.js";
import { updateEventDisplay } from "../lib/utils/event-display.js";

// Loader
import { loadEvent } from "../loaders/loadEvent.js";

// UI logic
import { hideDeploySwitch } from "./toggle/switch-deploy.js";
import { selectViewInformation } from "./modals/information.js";
import { hideInputModal } from "./modals/input.js";
import { switchEvent } from "./event-switcher.js";
import { activateView } from "./activate-view.js";

document
  .getElementById("visualize-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    if (getFileData() === null) {
      errorMsg("No data loaded!");
      return;
    }

    if (getCurrentView() === null) {
      errorMsg("No view selected!");
      return;
    }

    const eventIndex = document.getElementById("event-number").selectedIndex;

    if (!isPixiRunning()) {
      await startPixi();
    }
    hideInputModal();
    hideDeploySwitch();

    document.getElementById("event-switcher").style.display = "flex";

    document.getElementById("left-menu").style.display = "flex";
    document.getElementById("about-information-button").style.display = "block";

    document.getElementById("current-file-name").textContent = getFileName();
    document.getElementById("current-file").style.display = "flex";

    const eventSelectorMenu = document.getElementById("event-selector-menu");
    eventSelectorMenu.replaceChildren();
    const eventNumbers = getEventNumbers();
    for (const [eventIndex, eventNumber] of eventNumbers.entries()) {
      const option = document.createElement("div");
      option.className = "event-option";
      option.appendChild(document.createTextNode(`Event ${eventNumber}`));
      eventSelectorMenu.appendChild(option);
      option.addEventListener("click", () => {
        switchEvent(eventIndex);
        eventSelectorMenu.style.display = "none";
      });
    }

    document.getElementById("filters").style.display = "block";
    document.getElementById("particle-details").style.display = "block";

    selectViewInformation();

    loadEvent(eventIndex);
    updateEventDisplay();

    await activateView();
  });
