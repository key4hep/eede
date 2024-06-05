import { errorMsg, loadMCParticles } from "./tools.js";
import { PdgToggle } from "./menu/show-pdg.js";
import { drawAll } from "./draw.js";
import {
  bits,
  genStatus,
  renderRangeParameters,
  parametersRange,
} from "./menu/filter/filter.js";
import {
  mouseDown,
  mouseUp,
  mouseOut,
  mouseMove,
  getVisible,
  onScroll,
} from "./events.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const manipulationTools = document.getElementsByClassName("manipulation-tool");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let jsonData = {};

const dragTools = {
  draggedInfoBox: -1,
  isDragging: false,
  prevMouseX: 0,
  prevMouseY: 0,
};

const particlesHandler = {
  infoBoxes: [],
  parentLinks: [],
  childrenLinks: [],
};

const currentParticles = {
  infoBoxes: [],
  parentLinks: [],
  childrenLinks: [],
};

const visibleParticles = {
  infoBoxes: [],
  parentLinks: [],
  childrenLinks: [],
};

function start(particlesHandler, visibleParticles) {
  const { infoBoxes } = particlesHandler;

  if (!infoBoxes) {
    return;
  }

  // Get How many rows
  const rows = infoBoxes.map((obj) => {
    return obj.row;
  });
  const maxRow = Math.max(...rows);

  // Order infoBoxes into rows
  const boxRows = [];
  for (let i = 0; i <= maxRow; i++) {
    boxRows.push([]);
  }
  for (const box of infoBoxes) {
    boxRows[box.row].push(box.id);
  }
  const rowWidths = boxRows.map((obj) => {
    return obj.length;
  });
  const maxRowWidth = Math.max(...rowWidths);

  const boxWidth = infoBoxes[0].width;
  const boxHeight = infoBoxes[0].height;
  const horizontalGap = boxWidth * 0.4;
  const verticalGap = boxHeight * 0.3;

  canvas.width =
    boxWidth * (maxRowWidth + 1) + horizontalGap * (maxRowWidth + 1);
  canvas.height = boxHeight * (maxRow + 1) + verticalGap * (maxRow + 2);

  for (const [i, row] of boxRows.entries()) {
    for (const [j, boxId] of row.entries()) {
      const box = infoBoxes[boxId];

      if (row.length % 2 === 0) {
        const distanceFromCenter = j - row.length / 2;
        if (distanceFromCenter < 0) {
          box.x =
            canvas.width / 2 -
            boxWidth -
            horizontalGap / 2 +
            (distanceFromCenter + 1) * boxWidth +
            (distanceFromCenter + 1) * horizontalGap;
        } else {
          box.x =
            canvas.width / 2 +
            horizontalGap / 2 +
            distanceFromCenter * boxWidth +
            distanceFromCenter * horizontalGap;
        }
      } else {
        const distanceFromCenter = j - row.length / 2;
        box.x =
          canvas.width / 2 -
          boxWidth / 2 +
          distanceFromCenter * boxWidth +
          distanceFromCenter * horizontalGap;
      }
      box.y = i * verticalGap + verticalGap + i * boxHeight;
    }
  }

  drawAll(ctx, particlesHandler);

  getVisible(particlesHandler, visibleParticles);
}

canvas.onmousedown = (event) => {
  mouseDown(event, currentParticles, visibleParticles, dragTools);
};
canvas.onmouseup = (event) => {
  mouseUp(event, currentParticles, dragTools);
};
canvas.onmouseout = (event) => {
  mouseOut(event, dragTools);
};
canvas.onmousemove = (event) => {
  mouseMove(event, currentParticles, visibleParticles, dragTools);
};
window.onscroll = () => {
  onScroll(currentParticles, visibleParticles);
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

    loadMCParticles(jsonData, eventNum, particlesHandler);

    currentParticles.infoBoxes = particlesHandler.infoBoxes;
    currentParticles.parentLinks = particlesHandler.parentLinks;
    currentParticles.childrenLinks = particlesHandler.childrenLinks;

    if (particlesHandler.infoBoxes.length === 0) {
      errorMsg("Provided file does not contain any MC particle tree!");
      return;
    }
    for (const eventNum in jsonData) {
      delete jsonData[eventNum];
    }
    start(currentParticles, visibleParticles);
    hideInputModal();
    window.scroll((canvas.width - window.innerWidth) / 2, 0);

    for (const tool of manipulationTools) {
      tool.style.display = "flex";
    }

    const { infoBoxes } = currentParticles;

    infoBoxes.forEach((infoBox) => {
      bits.add(infoBox.simStatus);
      genStatus.add(infoBox.genStatus);
    });
    bits.setCheckBoxes();
    genStatus.setCheckBoxes();
    renderRangeParameters(filters, parametersRange);
    bits.render(filters);
    genStatus.render(filters);

    const pdgToggle = new PdgToggle("show-pdg");
    pdgToggle.init(() => {
      pdgToggle.toggle(infoBoxes, () => {
        drawAll(ctx, currentParticles);
      });
    });
  });

export { canvas, ctx, visibleParticles, particlesHandler, currentParticles };
