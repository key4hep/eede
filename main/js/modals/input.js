import { warningMsg, errorMsg } from "../lib/messages.js";
import {
  isPixiRunning,
  setFileData,
  getFileData,
  setFileName,
  getEventNumbers,
  setCurrentEventIndex,
  setCurrentView,
  getCurrentView
} from "../globals.js";
import { startPixi } from "../draw/app.js";
import {
  hideDeploySwitch,
  showEventSwitcher,
  showViewsMenu,
  showFilters
} from "../main.js";
import { updateFileName, showFileNameMenu } from "../current-file.js";
import { renderEvent, updateEventSelectorMenu } from "../load-event.js";
import { possibleViews } from "../views/views-dictionary.js";
import { selectViewInformation } from "../information.js";

export function hideInputModal() {
  document.getElementById("input-modal").style.display = "none";
}

export function showInputModal() {
  document.getElementById("input-modal").style.display = "block";
}

export function clearInputModal() {
  document.getElementById('input-message').replaceChildren();

  document.getElementById('input-modal-form').reset();

  document.getElementById("event-number").replaceChildren();
  document.getElementById("event-selector").style.display = "none";

  document.getElementById("available-views").replaceChildren();
  document.getElementById("input-modal-view-selector").style.display = "none";
}

document.getElementById("input-modal-file-input").addEventListener("change", (event) => {
  for (const file of event.target.files) {
    if (!file.name.endsWith("edm4hep.json")) {
      warningMsg("Provided file might not contain EDM4hep event data!");
    }

    if (!file.type.endsWith("/json")) {
      errorMsg("Provided file type is not JSON!");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const fileText = event.target.result;
      let ret = setFileData(JSON.parse(fileText));

      if (ret.err === true) {
        errorMsg(ret.msg);
        return;
      }

      setFileName(file.name);

      setCurrentEventIndex(0);

      const eventNumbers = getEventNumbers();
      const eventNumberSelector = document.getElementById("event-number");
      for (const [i, eventNumber] of eventNumbers.entries()) {
        const option = document.createElement('option');
        option.text = `Event ${eventNumber}`;
        eventNumberSelector.add(option, i);
      }
      eventNumberSelector.value = `Event ${eventNumbers[0]}`;
      document.getElementById("event-selector").style.display = "block";

      const availableViewsElem = document.getElementById("available-views");
      availableViewsElem.replaceChildren();
      const buttons = [];
      for (const viewName in possibleViews) {
        const button = document.createElement("button");
        button.appendChild(document.createTextNode(viewName));
        button.className = "view-button";
        button.onclick = (event) => {
          event.preventDefault();
          setCurrentView(viewName);
          for (const otherButton of buttons) {
            if (otherButton !== button) {
              otherButton.style.backgroundColor = "#f1f1f1";
            }
          }
          button.style.backgroundColor = "#c5c5c5";
        };
        buttons.push(button);
        availableViewsElem.appendChild(button);
      }
      document.getElementById("input-modal-view-selector").style.display = "initial";
    });
    reader.readAsText(file);
    break;
  }
});

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
    showEventSwitcher();
    showViewsMenu();
    updateFileName();
    updateEventSelectorMenu();
    showFileNameMenu();
    showFilters();
    selectViewInformation();
    renderEvent(eventIndex);
  });
