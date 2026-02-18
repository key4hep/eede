import { EDMObject } from "./EDMObject.js";
import { getName } from "../lib/getName.js";
import { parseCharge } from "../lib/parseCharge.js";
import { getSimStatusDisplayValuesFromBit } from "../lib/sim-status.js";
import {
  addLinesToBox,
  svgElementToPixiSprite,
  addImageToBox,
  removeImageFromBox,
} from "../draw/box.js";
import { textToSVG } from "../lib/generate-svg.js";

export class MCParticle extends EDMObject {
  constructor() {
    super();
    this.row = -1;
    this.texImg = null;
    this.color = "#dff6ff";
    this.radius = 8;
    this.width = 174; // 2:3 format
    this.height = 261;
    this.titleName = "MCParticle";
    this.margin = 16;
    this.padding = 8;
    this.imageMargin = 4;
    this.imageSize = 60;
  }

  async draw() {
    let [box, nextY] = await super.draw();

    const simulatorStatus = getSimStatusDisplayValuesFromBit(
      this.simulatorStatus,
    );
    const simulatorStatusFirstLetter = simulatorStatus
      .map((s) => s[0])
      .join("");
    const simulatorStatusString =
      simulatorStatusFirstLetter !== ""
        ? simulatorStatusFirstLetter
        : this.simulatorStatus;

    const topLine =
      `<div style="display: flex; flex-direction: row; gap: 4px; width: ${this.width}px;">
      <div style="flex: 1; text-align: left;">
        <div>ID: ${this.index}</div>
        <div>Gen. stat.: ${this.generatorStatus}</div>
        <div>Sim. stat.: ${simulatorStatusString}</div>
      </div>
    </div>`.replace(/\n\s+/g, "");

    nextY = addLinesToBox([topLine], box, nextY);

    const imageY = nextY + this.imageMargin;
    this.imageY = imageY;
    this.hasImage = false;

    nextY += this.imageSize + this.imageMargin;

    const bottomLine =
      `<div style="display: flex; flex-direction: row; gap: 4px; width: ${this.width}px;">
      <div>
        <div><i>P</i><sub>T</sub></div>
        <div>cos(θ)</div>
        <div>p</div>
        <div>d</div>
      </div>
      <div>
        <div>= ${this.transverseMomentum} GeV<sub></sub></div>
        <div>= ${this.cosTheta}</div>
        <div>= ${this.momentum} GeV</div>
        <div>= ${this.vertex} mm</div>
      </div>
    </div>`.replace(/\n\s+/g, "");

    addLinesToBox([bottomLine], box, nextY);
  }

  objectModalLines() {
    const modalLines = [];

    modalLines.push(
      `
      <div>Collection: ${this.collectionName}</div>
      <div>PDG ID: ${this.PDG}</div>
      <div style="display: flex; flex-direction: row; margin-top: 8px; gap: 4px;">
        <div>
          <div>t</div>
          <div>m</div>
          <div>φ</div>
          <div>q</div>
        </div>
        <div>
          <div>= ${this.time} ns</div>
          <div>= ${this.mass} GeV</div>
          <div>= ${this.phi}</div>
          <div>= ${parseCharge(this.charge)}</div>
        </div>
      </div>
      `.replace(/\n\s+/g, ""),
    );

    const simulatorStatus = getSimStatusDisplayValuesFromBit(
      this.simulatorStatus,
    );

    return [...modalLines, ...simulatorStatus];
  }

  async drawImage(text, imageY) {
    const id = `${text}-${this.imageSize}`;
    const src = await textToSVG(id, text, this.width * 0.9, this.imageSize);
    const sprite = await svgElementToPixiSprite(id, src);
    this.image = sprite;
    addImageToBox(sprite, this.renderedBox, imageY);
  }

  isVisible() {
    const isVisible = super.isVisible();

    if (isVisible) {
      if (!this.hasImage) {
        this.hasImage = true;
        this.drawImage(this.textToRender, this.imageY);
      }
    } else {
      if (this.image) {
        removeImageFromBox(this.image, this.renderedBox);
        this.image.destroy();
        this.image = null;
        this.hasImage = false;
      }
    }

    return isVisible;
  }

  static setRows(mcCollection) {
    mcCollection.forEach((mcParticle) => {
      mcParticle.row = -1;

      const parentLength = mcParticle.oneToManyRelations["parents"].length;
      const daughterLength = mcParticle.oneToManyRelations["daughters"].length;

      if (parentLength === 0 && daughterLength === 0) {
        mcParticle.row = -1;
        console.log("WARNING: Standalone particle!");
      }

      if (parentLength === 0) {
        mcParticle.row = 0;
      }
    });
  }

  static setup(mcCollection) {
    for (const mcParticle of mcCollection) {
      const name = getName(mcParticle.PDG);
      const momentum = mcParticle.momentum;

      mcParticle.name = name;
      mcParticle.textToRender = name;

      mcParticle.momentum = Math.sqrt(
        Math.pow(momentum.x, 2) +
          Math.pow(momentum.y, 2) +
          Math.pow(momentum.z, 2),
      );

      mcParticle.vertex = Math.sqrt(
        Math.pow(mcParticle.vertex.x, 2) +
          Math.pow(mcParticle.vertex.y, 2) +
          Math.pow(mcParticle.vertex.z, 2),
      );

      mcParticle.cosTheta = momentum.z / mcParticle.momentum;
      mcParticle.phi = Math.atan2(momentum.y, momentum.x);
      mcParticle.transverseMomentum = Math.sqrt(
        Math.pow(momentum.x, 2) + Math.pow(momentum.y, 2),
      );

      mcParticle.cosTheta = Math.round(mcParticle.cosTheta * 100) / 100;
      mcParticle.phi = Math.round(mcParticle.phi * 100) / 100;
      mcParticle.transverseMomentum =
        Math.round(mcParticle.transverseMomentum * 100) / 100;

      mcParticle.momentum = Math.round(mcParticle.momentum * 100) / 100;
      mcParticle.vertex = Math.round(mcParticle.vertex * 100) / 100;
      mcParticle.time = Math.round(mcParticle.time * 100) / 100;
      mcParticle.mass = Math.round(mcParticle.mass * 100) / 100;
    }
  }
}
