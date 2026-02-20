const particleDetails = document.getElementById("particle-details");
let selectedBox = null;

export function showParticleDetails(box, lines, colorOnClick, colorOnHover) {
  let changeSelection = false;
  let clickPostion = null;

  box.on("pointerenter", () => {
    if (selectedBox !== box) {
      box.tint = colorOnHover;
    }
  });

  box.on("pointerleave", () => {
    if (selectedBox !== box) {
      box.tint = 0xffffff;
    }
  });

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
      selectedBox.tint = 0xffffff;
      selectedBox = null;
      particleDetails.innerHTML = "";
    } else {
      // Change selection when a different particle is clicked
      if (selectedBox) selectedBox.tint = 0xffffff;

      // Select particle
      box.tint = colorOnClick;
      selectedBox = box;
      particleDetails.innerHTML = lines.join("");
    }
  });
}
