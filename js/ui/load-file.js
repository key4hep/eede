// Handles JSON file formatting and replacement.

// Globals
import {
  clearAllEventData,
  setFileData,
  setFileName,
  getEventNumbers,
  setCurrentEventIndex,
  setCurrentView,
} from "../state/globals.js";

// Utils
import { warningMsg, errorMsg } from "../lib/utils/messages.js";

// Visualization code
import { possibleViews } from "../viz/views/viewsDictionary.js";

// UI logic
import {
  hideInputModalCloseButton,
  showInputModalCloseButton,
  clearInputModal,
  showInputModal,
} from "./modals/input.js";

document
  .getElementById("input-modal-file-input")
  .addEventListener("change", (event) => {
    hideInputModalCloseButton();

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
          const option = document.createElement("option");
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
        document.getElementById("input-modal-view-selector").style.display =
          "initial";
      });
      reader.readAsText(file);
      break;
    }
  });

document.getElementById("change-file").addEventListener("click", () => {
  clearInputModal();
  showInputModalCloseButton();
  clearAllEventData();
  showInputModal();
});
