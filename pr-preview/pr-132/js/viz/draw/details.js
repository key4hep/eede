import { getApp, getContainer } from "../../state/pixi-state.js";
import { filteredOut } from "../../lib/constants/vizStyles.js";

const particleDetails = document.getElementById("particle-details");
let selectedBox = null;
let backgroundListener = false;

function deselect() {
  selectedBox.tint = 0xffffff;
  selectedBox = null;
  particleDetails.classList.remove("selected");
  particleDetails.innerHTML = "";
}

export function showParticleDetails(object) {
  const box = object.renderedBox;
  const hoverColor = () =>
    object.filteredOut ? filteredOut.colorOnHover : object.colorOnHover;
  const clickColor = () =>
    object.filteredOut ? filteredOut.colorOnClick : object.colorOnClick;

  if (!backgroundListener) {
    const app = getApp();

    backgroundListener = true;

    app.stage.on("pointerup", (event) => {
      // Undo selection when backgroud is clicked
      if (selectedBox !== null && event.target === getContainer()) deselect();
    });
  }

  box.on("pointerenter", () => {
    if (selectedBox !== box) {
      box.tint = hoverColor();
    }
  });

  box.on("pointerleave", () => {
    if (selectedBox !== box) {
      box.tint = 0xffffff;
    }
  });

  let changeSelection = false;
  let clickPostion = null;

  box.on("pointerdown", (event) => {
    changeSelection = true;
    clickPostion = { x: event.global.x, y: event.global.y };
  });

  box.on("pointermove", (event) => {
    if (clickPostion === null) return;

    const dx = event.global.x - clickPostion.x;
    const dy = event.global.y - clickPostion.y;

    if (dx * dx + dy * dy > 4) changeSelection = false;
  });

  box.on("pointerup", () => {
    // Do not change selection if particle was dragged
    if (!changeSelection) return;

    if (selectedBox === box) {
      // Undo selection when selected particle is clicked again
      deselect();
    } else {
      // Change selection when a different particle is clicked
      if (selectedBox) selectedBox.tint = 0xffffff;

      // Select particle
      box.tint = clickColor();
      selectedBox = box;
      particleDetails.classList.add("selected");
      particleDetails.innerHTML = object.objectModalLines().join("");
    }
  });
}
