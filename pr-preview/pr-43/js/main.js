import { errorMsg } from "./tools.js";
import { PdgToggle } from "./menu/show-pdg.js";
import { drawAll } from "./draw.js";
import { getWidthFilterContent } from "./menu/filter/filter.js";
import { mouseDown, mouseUp, mouseOut, mouseMove, onScroll } from "./events.js";
import { renderEvent } from "./menu/event-number.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const jsonData = {};

const dragTools = {
  draggedObject: null,
  isDragging: false,
  prevMouseX: 0,
  prevMouseY: 0,
};

const loadedObjects = {};

const currentObjects = {};

const visibleObjects = {};

const selectedObjectTypes = {
  types: [
    "edm4hep::MCParticle",
    "edm4hep::ReconstructedParticle",
    "edm4hep::MCRecoParticleAssociation",
  ],
};

canvas.onmousedown = (event) => {
  mouseDown(event, visibleObjects, dragTools);
};
canvas.onmouseup = (event) => {
  mouseUp(event, currentObjects, dragTools);
};
canvas.onmouseout = (event) => {
  mouseOut(event, dragTools);
};
canvas.onmousemove = (event) => {
  mouseMove(event, visibleObjects, dragTools);
};
window.onscroll = () => {
  onScroll(currentObjects, visibleObjects);
};

function hideInputModal() {
  const modal = document.getElementById("input-modal");

  modal.style.display = "none";
}

function showEventSwitcher() {
  const eventSwitcher = document.getElementById("event-switcher");
  eventSwitcher.style.display = "flex";
}

document.getElementById("input-file").addEventListener("change", (event) => {
  for (const file of event.target.files) {
    if (!file.name.endsWith("edm4hep.json")) {
      errorMsg("Provided file is not EDM4hep JSON!");
    }

    if (!file.type.endsWith("/json")) {
      errorMsg("ERROR: Provided file is not EDM4hep JSON!");
    }

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const fileText = event.target.result;
      jsonData.data = JSON.parse(fileText);

      const eventNumberInput = document.getElementById("event-number");
      const options = Object.keys(jsonData.data).map((event) =>
        parseInt(event.replace("Event ", ""))
      );
      eventNumberInput.max = Object.keys(options).length - 1;
      if (options.length === 0) {
        errorMsg("No events found in the file!");
        return;
      }
      eventNumberInput.value = options[0];
      document.getElementById("event-selector").style.display = "block";
      const eventOptions = document.getElementById("event-number");
      const eventSelectorMenu = document.getElementById("event-selector-menu");
      eventOptions.replaceChildren();
      eventSelectorMenu.replaceChildren();
      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.appendChild(document.createTextNode(option));
        eventOptions.appendChild(optionElement);

        const optionElementMenu = document.createElement("div");
        optionElementMenu.className = "event-option";
        optionElementMenu.appendChild(document.createTextNode(option));
        eventSelectorMenu.appendChild(optionElementMenu);
        optionElementMenu.addEventListener("click", () => {
          renderEvent(option);
          eventSelectorMenu.style.display = "none";
        });
      });
    });
    reader.readAsText(file);
    break;
  }
});

document
  .getElementById("visualize-button")
  .addEventListener("click", (event) => {
    event.preventDefault();

    if (jsonData.data === undefined) {
      errorMsg("No data loaded!");
      return;
    }

    const eventNum = document.getElementById("event-number").value;

    hideInputModal();
    showEventSwitcher();
    renderEvent(eventNum);

    const width = getWidthFilterContent();
    filter.style.width = width;
    const pdgToggle = new PdgToggle("show-pdg");
    pdgToggle.init(() => {
      pdgToggle.toggle(currentObjects, () => {
        drawAll(ctx, currentObjects);
      });
    });
  });

export {
  canvas,
  ctx,
  loadedObjects,
  currentObjects,
  visibleObjects,
  jsonData,
  selectedObjectTypes,
};
