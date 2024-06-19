import { Toggle } from "./toggle.js";

export class PdgToggle extends Toggle {
  constructor(id) {
    super(id);
  }

  toggle(currentObjects, redraw) {
    const validParticles = ["edm4hep::MCParticle"];

    if (this.isSliderActive) {
      for (const objectType of validParticles) {
        const collection = currentObjects[objectType].collection;
        for (const object of collection) {
          object.updateTexImg(`${object.PDG}`);
        }
      }
    } else {
      for (const objectType of validParticles) {
        const collection = currentObjects[objectType].collection;
        for (const object of collection) {
          object.updateTexImg(`${object.name}`);
        }
      }
    }

    redraw();
  }
}
