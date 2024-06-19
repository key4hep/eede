import { errorMsg } from "./tools.js";
import { PdgToggle } from "./menu/show-pdg.js";
import { drawAll } from "./draw.js";
import {
  bits,
  genStatus,
  renderRangeParameters,
  parametersRange,
  getWidthFilterContent,
  renderGenSim,
} from "./menu/filter/filter.js";
import {
  mouseDown,
  mouseUp,
  mouseOut,
  mouseMove,
  getVisible,
  onScroll,
} from "./events.js";
import { loadObjects } from "./types/load.js";
import { objectTypes } from "./types/objects.js";
import { copyObject } from "./lib/copy.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const manipulationTools = document.getElementsByClassName("manipulation-tool");
const filter = document.getElementById("filter");
const filters = document.getElementById("filters");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let jsonData = {};

const dragTools = {
  draggedObject: null,
  isDragging: false,
  prevMouseX: 0,
  prevMouseY: 0,
};

const loadedObjects = {};

const currentObjects = {};

const visibleObjects = {};

function start(currentObjects, visibleObjects) {
  for (const [key, value] of Object.entries(currentObjects)) {
    const classType = objectTypes[key];
    const collection = value.collection;
    classType.setup(collection, canvas);
  }

  drawAll(ctx, currentObjects);

  getVisible(currentObjects, visibleObjects);
}

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

/*
function showInputModal() {
  const modal = document.getElementById("input-modal");

  modal.style.display = "block";
}
*/

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
      jsonData = JSON.parse(fileText);

      const eventNumberInput = document.getElementById("event-number");
      eventNumberInput.max = Object.keys(jsonData).length - 1;
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

    const selectedObjectTypes = ["edm4hep::MCParticle"];
    const objects = loadObjects(jsonData, eventNum, selectedObjectTypes);

    copyObject(objects, loadedObjects);
    copyObject(objects, currentObjects);

    const length = Object.values(loadedObjects)
      .map((obj) => obj.collection.length)
      .reduce((a, b) => a + b, 0);

    if (length === 0) {
      errorMsg("Provided file does not contain any MC particle tree!");
      return;
    }
    for (const eventNum in jsonData) {
      delete jsonData[eventNum];
    }
    start(currentObjects, visibleObjects);
    hideInputModal();
    window.scroll((canvas.width - window.innerWidth) / 2, 0);

    for (const tool of manipulationTools) {
      tool.style.display = "flex";
    }

    const mcObjects = loadedObjects["edm4hep::MCParticle"].collection;
    mcObjects.forEach((mcObject) => {
      genStatus.add(mcObject.generatorStatus);
    });
    genStatus.setCheckBoxes();
    renderRangeParameters(filters, parametersRange);
    const width = getWidthFilterContent();
    filter.style.width = width;

    renderGenSim(bits, genStatus, filters);

    const pdgToggle = new PdgToggle("show-pdg");
    pdgToggle.init(() => {
      pdgToggle.toggle(currentObjects, () => {
        drawAll(ctx, currentObjects);
      });
    });
  });

export { canvas, ctx, loadedObjects, currentObjects, visibleObjects };
