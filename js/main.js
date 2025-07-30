import { errorMsg } from "./lib/messages.js";
import { renderEvent } from "./event-number.js";
import { views } from "./views/views-dictionary.js";
import { selectViewInformation } from "./information.js";
import { startPixi } from "./draw/app.js";
import { setFileName, showFileNameMenu } from "./current-file.js";
import { setFileData,
         getFileData,
         getEventNumbers,
         setCurrentEventIndex,
         setCurrentView,
         getCurrentView } from "./globals.js"

function hideInputModal() {
  const modal = document.getElementById("input-modal");

  modal.style.display = "none";
}

function showEventSwitcher() {
  const eventSwitcher = document.getElementById("event-switcher");

  eventSwitcher.style.display = "flex";
}

function showViewsMenu() {
  const viewsMenu = document.getElementById("left-menu");
  const aboutButton = document.getElementById("information-button");

  viewsMenu.style.display = "flex";
  aboutButton.style.display = "block";
}

function hideDeploySwitch() {
  const deploySwitch = document.getElementById("switch-deploy");

  deploySwitch.style.display = "none";
}

function showFilters() {
  const filters = document.getElementById("filters");

  filters.style.display = "block";
}

document.getElementById("input-file").addEventListener("change", (event) => {
  for (const file of event.target.files) {
    if (!file.name.endsWith("edm4hep.json")) {
      errorMsg("Provided file is not EDM4hep JSON!");
    }

    if (!file.type.endsWith("/json")) {
      errorMsg("ERROR: Provided file is not EDM4hep JSON!");
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const fileText = event.target.result;
      let ret = setFileData(JSON.parse(fileText));

      if (ret.err === true) {
        errorMsg(ret.msg);
        return;
      }

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

      const eventSelectorMenu = document.getElementById("event-selector-menu");
      eventSelectorMenu.replaceChildren();
      eventNumbers.forEach((eventNumber) => {
        const optionElementMenu = document.createElement("div");
        optionElementMenu.className = "event-option";
        optionElementMenu.appendChild(document.createTextNode(`Event ${eventNumber}`));
        eventSelectorMenu.appendChild(optionElementMenu);
        optionElementMenu.addEventListener("click", () => {
          renderEvent(eventNumber);
          eventSelectorMenu.style.display = "none";
        });
      });

      const availableViews = document.getElementById("available-views");
      availableViews.replaceChildren();
      const buttons = [];
      for (const key in views) {
        const button = document.createElement("button");
        button.appendChild(document.createTextNode(key));
        button.className = "view-button";
        button.onclick = (event) => {
          event.preventDefault();
          setCurrentView(key);
          for (const otherButton of buttons) {
            if (otherButton !== button) {
              otherButton.style.backgroundColor = "#f1f1f1";
            }
          }
          button.style.backgroundColor = "#c5c5c5";
        };
        buttons.push(button);
        availableViews.appendChild(button);
      }
      document.getElementById("view-selector").style.display = "initial";
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

    if (getCurrentView() === undefined) {
      errorMsg("No view selected!");
      return;
    }

    const eventIndex = document.getElementById("event-number").selectedIndex;

    await startPixi();
    hideInputModal();
    hideDeploySwitch();
    showEventSwitcher();
    showViewsMenu();
    showFileNameMenu();
    showFilters();
    selectViewInformation();
    renderEvent(eventIndex);
  });
