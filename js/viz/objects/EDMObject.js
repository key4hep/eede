import {
  buildBox,
  addBox,
  addTitleToBox,
  showParticleDetails,
} from "../draw/box.js";
import { dragStart } from "../draw/drag.js";
import { getContainer } from "../draw/app.js";
import { Rectangle } from "pixi.js";

export class EDMObject {
  constructor() {
    this.x = NaN;
    this.y = NaN;
    this.index = NaN;
    this.collectionId = NaN;
    this.width = 120;
    this.height = 260;
    this.lineColor = "black";
    this.lineWidth = 2;
    this.color = "white";
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

    showParticleDetails(box, this.objectModalLines());
    return [box, nextY];
  }

  objectModalLines() {
    const collectionName = "Collection: " + this.collectionName;
    return [collectionName];
  }

  isVisible() {
    const viewport = getContainer();

    return (
      viewport.right > this.x &&
      viewport.left < this.x + this.width &&
      viewport.bottom > this.y &&
      viewport.top < this.y + this.height
    );
  }

  saveRelations() {
    const relations = {};

    if (!this.relations) {
      relations.oneToManyRelations = this.oneToManyRelations;
      relations.oneToOneRelations = this.oneToOneRelations;
      this.relations = relations;

      this.oneToManyRelations = {};
      this.oneToOneRelations = {};
    }
  }

  restoreRelations() {
    if (this.relations) {
      this.oneToManyRelations = this.relations.oneToManyRelations;
      this.oneToOneRelations = this.relations.oneToOneRelations;
    }
    this.relations = null;
  }
}
