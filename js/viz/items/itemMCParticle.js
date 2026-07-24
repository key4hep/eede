import { EDMObject } from "./itemEDMObject.js";
import { getName } from "../../lib/utils/getName.js";
import { parseCharge } from "../../lib/utils/parseCharge.js";
import { getSimStatusDisplayValuesFromBit } from "../../lib/utils/sim-status.js";
import { svgElementToPixiSprite, addImageToBox } from "../draw/box.js";
import { addLinesToBox } from "../draw/font.js";
import { textToSVG } from "../../lib/utils/generate-svg.js";
import { objectColor } from "../../lib/constants/vizStyles.js";

export class MCParticle extends EDMObject {
  constructor() {
    super();
    this.width = 195; // 3:4 format
    this.height = 260;
    this.titleName = "MCParticle";
    this.color = objectColor.sky100;
    this.colorOnHover = objectColor.sky200;
    this.colorOnClick = objectColor.sky400;
    this.lineColor = objectColor.sky400;
    this.row = -1;
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

    nextY += this.imageSize + this.imageMargin;

    const roundedMomentum =
      this.momentum.toString().split("").length > 5
        ? Math.round(this.momentum * 10) / 10 // Round one decimal place
        : this.momentum;

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
        <div>= ${roundedMomentum} GeV</div>
        <div>= ${this.vertex} mm</div>
      </div>
    </div>`.replace(/\n\s+/g, "");

    addLinesToBox([bottomLine], box, nextY);
    this.drawImage(this.textToRender, imageY);
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
