import { errorMsg } from "./tools.js";
import { PdgToggle } from "./menu/show-pdg.js";
import { drawAll } from "./draw.js";
import { getWidthFilterContent } from "./menu/filter/filter.js";
import { mouseDown, mouseUp, mouseOut, mouseMove, onScroll } from "./events.js";
import { showEventSwitcher, loadSelectedEvent } from "./menu/event-number.js";

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
  types: ["edm4hep::MCParticle"],
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
    });
    reader.readAsText(file);
    break;
  }
});

document
  .getElementById("visualize-button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    const eventNum = document.getElementById("event-number").value;

    hideInputModal();
    showEventSwitcher(eventNum);
    loadSelectedEvent();

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
