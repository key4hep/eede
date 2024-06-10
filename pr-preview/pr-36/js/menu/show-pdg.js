// const slider = document.getElementById("show-pdg");
import { Toggle } from "./toggle.js";

export class PdgToggle extends Toggle {
  constructor(id) {
    super(id);
  }

  toggle(infoBoxes, redraw) {
    if (this.isSliderActive) {
      for (const infoBox of infoBoxes) {
        infoBox.updateTexImg(`${infoBox.pdg}`);
      }
    } else {
      for (const infoBox of infoBoxes) {
        infoBox.updateTexImg(infoBox.name);
      }
    }

    redraw();
  }
}
