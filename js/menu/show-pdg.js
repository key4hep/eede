import { Toggle } from "./toggle.js";
import { selectedObjectTypes } from "../main.js";

export class PdgToggle extends Toggle {
  constructor(id) {
    super(id);
  }

  toggle(currentObjects, redraw) {
    const validObjects = selectedObjectTypes.types;

    if (this.isSliderActive) {
      for (const objectType of validObjects) {
        const collection = currentObjects[objectType].collection;
        if (collection[0].PDG === undefined) return;
        for (const object of collection) {
          object.updateTexImg(`${object.PDG}`);
        }
      }
    } else {
      for (const objectType of validObjects) {
        const collection = currentObjects[objectType].collection;
        if (collection[0].PDG === undefined) return;
        for (const object of collection) {
          object.updateTexImg(`${object.name}`);
        }
      }
    }

    redraw();
  }
}
