import { warningMsg, errorMsg } from "../../lib/utils/messages.js";
import { getFileName, clearAllEventData } from "./globals.js";
import {
  isPixiRunning,
  setFileData,
  getFileData,
  setFileName,
  getEventNumbers,
  setCurrentEventIndex,
  setCurrentView,
  getCurrentView,
  getCurrentEventIndex,
  getCurrentEventNumber,
  getCurrentEventName,
  eventCollection,
  currentVisObjects,
  getCurrentVisObjects,
  saveCurrentScrollPosition,
  getSavedScrollPosition,
} from "../../state/globals.js";
import {
  startPixi,
  getViewportPosition,
  setViewportPosition,
  saveSize,
} from "../../state/pixi-state.js";
import { hideDeploySwitch } from "../toggle/switch-deploy.js";
import { possibleViews } from "../../viz/views/viewsDictionary.js";
import { selectViewInformation } from "./information.js";
import { loadObjects } from "../../loaders/load.js";
import { objectTypes } from "../../lib/constants/objectTypes.js";
import { copyObject } from "../../lib/utils/copy.js";
import { checkEmptyObject } from "../../lib/utils/empty-object.js";
import {
  emptyViewMessage,
  hideEmptyViewMessage,
  showMessage,
} from "../../lib/utils/messages.js";
import { showViewInformation, hideViewInformation } from "./information.js";
import { renderObjects } from "../../viz/draw/render.js";
import { setRenderable } from "../../viz/draw/renderable.js";
import { handleFilters } from "../filters/filter.js";
import { setupToggles } from "../toggle/toggle.js";

export function hideInputModal() {
  document.getElementById("input-modal").style.display = "none";
}

export function showInputModal() {
  document.getElementById("input-modal").style.display = "block";
}

export function hideInputModalCloseButton() {
  document.getElementById("input-modal-close-button").style.display = "none";
}

export function showInputModalCloseButton() {
  document.getElementById("input-modal-close-button").style.display = "block";
}

export function clearInputModal() {
  document.getElementById("input-message").replaceChildren();

  document.getElementById("input-modal-form").reset();

  document.getElementById("event-number").replaceChildren();
  document.getElementById("event-selector").style.display = "none";

  document.getElementById("available-views").replaceChildren();
  document.getElementById("input-modal-view-selector").style.display = "none";
}

function renderEvent(eventIndex) {
  setCurrentEventIndex(eventIndex);

  // load selected event
  const currentEventIndex = getCurrentEventIndex();
  if (eventCollection[currentEventIndex] === undefined) {
    const objects = loadObjects(getFileData(), getCurrentEventNumber());

    eventCollection[currentEventIndex] = objects;

    for (const datatype in eventCollection[currentEventIndex].datatypes) {
      const classType = objectTypes[datatype];
      const collection =
        eventCollection[currentEventIndex].datatypes[datatype].collection;
      classType.setup(collection);
    }
    copyObject(objects, currentVisObjects);
  } else {
    copyObject(eventCollection[currentEventIndex], currentVisObjects);
  }

  // update event number
  if (eventNumberElem.firstChild) {
    eventNumberElem.removeChild(eventNumberElem.firstChild);
  }
  eventNumberElem.appendChild(document.createTextNode(getCurrentEventName()));

  drawView(getCurrentView());
}

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
  const {
    selectorFunction,
    layoutFunction,
    positionFunction,
    collections,
    description,
  } = possibleViews[view];

  const allVisObjects = getCurrentVisObjects();

  const viewObjects = {};
  selectorFunction(allVisObjects, viewObjects);

  // paint buttons
  const buttons = document.querySelectorAll("#view-selector .view-button");
  for (const button of buttons) {
    if (button.innerText === view) {
      button.style.backgroundColor = "#c5c5c5";
    } else {
      button.style.backgroundColor = "#f1f1f1";
    }
  }

  const isEmpty = checkEmptyObject(viewObjects);

  if (isEmpty) {
    emptyViewMessage();
    hideViewInformation();
    return;
  }

  showViewInformation(view, description);

  // set info button name
  const button = document.getElementById("view-information-button");
  button.innerText = getCurrentView();

  hideEmptyViewMessage();

  await renderView(layoutFunction, viewObjects);

  const savedPosition = getSavedScrollPosition();
  if (savedPosition) {
    setViewportPosition(savedPosition.x, savedPosition.y);
  } else {
    positionFunction();
    saveCurrentScrollPosition(getViewportPosition());
  }

  setRenderable(viewObjects);
  handleFilters(viewObjects, collections, setRenderable);
  setupToggles(collections, viewObjects);
};

// Page updates
const eventNumberElem = document.getElementById("selected-event");
const previousEvent = document.getElementById("previous-event");
const nextEvent = document.getElementById("next-event");

previousEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getCurrentEventIndex();

  if (currentEventIndex <= 0) {
    return;
  }

  const newEventNum = `${eventNumbers[currentEventIndex - 1]}`;
  saveCurrentScrollPosition(getViewportPosition());
  renderEvent(newEventNum);
});

nextEvent.addEventListener("click", () => {
  const eventNumbers = getEventNumbers();
  const currentEventIndex = getCurrentEventIndex();

  if (currentEventIndex + 1 >= eventNumbers.length) {
    return;
  }

  const newEventNum = `${eventNumbers[currentEventIndex + 1]}`;
  saveCurrentScrollPosition(getViewportPosition());
  renderEvent(newEventNum);
});

eventNumberElem.addEventListener("click", () => {
  const eventSelectorMenu = document.getElementById("event-selector-menu");
  if (eventSelectorMenu.style.display === "flex") {
    eventSelectorMenu.style.display = "none";
  } else {
    eventSelectorMenu.style.display = "flex";
  }
});

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

    // show event switcher();
    const eventSwitcher = document.getElementById("event-switcher");
    eventSwitcher.style.display = "flex";

    // show views menu();
    const viewsMenu = document.getElementById("left-menu");
    const aboutButton = document.getElementById("about-information-button");
    viewsMenu.style.display = "flex";
    aboutButton.style.display = "block";

    // update file name
    const fileName = getFileName();
    const fileNameElem = document.getElementById("current-file-name");
    fileNameElem.textContent = fileName;

    // update event selector menu;
    const eventSelectorMenu = document.getElementById("event-selector-menu");
    eventSelectorMenu.replaceChildren();

    const eventNumbers = getEventNumbers();
    for (const [eventIndex, eventNumber] of eventNumbers.entries()) {
      const optionElementMenu = document.createElement("div");
      optionElementMenu.className = "event-option";
      optionElementMenu.appendChild(
        document.createTextNode(`Event ${eventNumber}`),
      );
      eventSelectorMenu.appendChild(optionElementMenu);
      optionElementMenu.addEventListener("click", () => {
        saveCurrentScrollPosition(getViewportPosition());
        renderEvent(eventIndex);
        eventSelectorMenu.style.display = "none";
      });
    }
    // show file name menu
    const fileNameMenu = document.getElementById("current-file");
    fileNameMenu.style.display = "flex";

    // show filters
    const filters = document.getElementById("filters");
    filters.style.display = "block";

    // show particle details();
    document.getElementById("particle-details").style.display = "block";

    selectViewInformation();
    renderEvent(eventIndex);
  });

document
  .getElementById("input-modal-close-button")
  .addEventListener("click", hideInputModal);

document.getElementById("change-file").addEventListener("click", () => {
  clearInputModal();
  showInputModalCloseButton();
  clearAllEventData();
  showInputModal();
});
