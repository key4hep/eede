import { buildBox, addBox } from "../draw/box.js";
import { showParticleDetails } from "../draw/details.js";
import { addTitleToBox } from "../draw/font.js";
import { dragStart } from "../draw/drag.js";
import { Rectangle } from "pixi.js";

export class EDMObject {
  constructor() {
    this.x = NaN;
    this.y = NaN;
    this.index = NaN;
    this.collectionId = NaN;
    this.lineWidth = 1;
    this.radius = 8;
  }

  async draw() {
    const box = buildBox(this);
    this.renderedBox = box;
    box.zIndex = 1;
    box.interactiveChildren = false;
    addBox(box);
    box.position.set(this.x, this.y);
    const nextY = addTitleToBox(this.titleName, box);

    box.cursor = "pointer";
    box.eventMode = "static";
    box.on("pointerdown", dragStart, this);
    box.cullable = true;
    box.cullArea = new Rectangle(box.x, box.y, box.width, box.height);

    showParticleDetails(this);
    return [box, nextY];
  }

  objectModalLines() {
    const collectionName = "Collection: " + this.collectionName;
    return [collectionName];
  }

}
