import { getName } from "../lib/getName.js";
import { linkTypes } from "./links.js";
import { parseCharge } from "../lib/parseCharge.js";
import { getSimStatusDisplayValuesFromBit } from "../../mappings/sim-status.js";
import {
  buildBox,
  addBox,
  addTitleToBox,
  addLinesToBox,
  svgElementToPixiSprite,
  addImageToBox,
  addHoverModal,
} from "../draw/box.js";
import { textToSVG } from "../lib/generate-svg.js";

const TOP_MARGIN = 45;
const IMAGE_MARGIN = 10;
const IMAGE_HEIGHT = 30;

class EDMObject {
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
    addBox(box);
    box.position.set(this.x, this.y);
    const nextY = addTitleToBox(this.constructor.name, box);

    box.cursor = "pointer";
    box.eventMode = "static";

    let prevX = box.x + box.width / 2;
    let prevY = box.y + box.height / 2;

    box
      .on(
        "pointerdown",
        function () {
          this.on(
            "pointermove",
            function (event) {
              const container = box.parent;

              const eventX = container.toLocal(event.data.global).x;
              const eventY = container.toLocal(event.data.global).y;

              const deltaX = eventX - prevX;
              const deltaY = eventY - prevY;

              this.position.x += deltaX;
              this.position.y += deltaY;
              prevX = eventX;
              prevY = eventY;
            },
            box
          );
        },
        box
      )
      .on(
        "pointerup",
        function () {
          this.off("pointermove");
        },
        box
      );

    addHoverModal(box, this.objectModalLines());
    return [box, nextY];
  }

  isHere(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    );
  }

  isVisible(x, y, width, height) {
    return (
      x + width > this.x &&
      x < this.x + this.width &&
      y + height > this.y &&
      y < this.y + this.height
    );
  }

  objectModalLines() {
    const collectionName = "Collection: " + this.collectionName;
    return [collectionName];
  }
}

export class MCParticle extends EDMObject {
  constructor() {
    super();
    this.row = -1;
    this.texImg = null;
    this.color = "#dff6ff";
    this.radius = 15;
    this.height = 270;
  }

  async draw() {
    let [box, nextY] = await super.draw();

    const topLines = [];
    topLines.push("ID: " + this.index);
    topLines.push("Gen. stat.: " + this.generatorStatus);
    const simulatorStatus = getSimStatusDisplayValuesFromBit(
      this.simulatorStatus
    );
    const simulatorStatusFirstLetter = simulatorStatus
      .map((s) => s[0])
      .join("");
    const simulatorStatusString =
      simulatorStatusFirstLetter !== ""
        ? simulatorStatusFirstLetter
        : this.simulatorStatus;
    topLines.push("Sim. stat.: " + simulatorStatusString);

    nextY = addLinesToBox(topLines, box, nextY);

    const imageY = nextY + IMAGE_MARGIN;

    textToSVG(this.name)
      .then((src) => {
        const sprite = svgElementToPixiSprite(src);
        return sprite;
      })
      .then((sprite) => addImageToBox(sprite, box, imageY))
      .catch((e) => console.error("Error loading SVG: ", e));

    nextY += IMAGE_HEIGHT + 2 * IMAGE_MARGIN;

    const bottomLines = [];
    bottomLines.push("p = " + this.momentum + " GeV");
    bottomLines.push("d = " + this.vertex + " mm");
    bottomLines.push("t = " + this.time + " ns");
    bottomLines.push("m = " + this.mass + " GeV");
    bottomLines.push(parseCharge(this.charge));

    addLinesToBox(bottomLines, box, nextY);
  }

  objectModalLines() {
    const collectionName = "Collection: " + this.collectionName;
    const simulatorStatus = getSimStatusDisplayValuesFromBit(
      this.simulatorStatus
    );
    return [collectionName, ...simulatorStatus];
  }

  static setup(mcCollection) {
    for (const mcParticle of mcCollection) {
      const parentLength = mcParticle.oneToManyRelations["parents"].length;
      const daughterLength = mcParticle.oneToManyRelations["daughters"].length;

      if (parentLength === 0 && daughterLength === 0) {
        mcParticle.row = -1;
        console.log("WARNING: Standalone particle!");
      }

      if (parentLength === 0) {
        mcParticle.row = 0;
      }

      const name = getName(mcParticle.PDG);
      mcParticle.name = name;
      mcParticle.momentum = Math.sqrt(
        Math.pow(mcParticle.momentum.x, 2) +
          Math.pow(mcParticle.momentum.y, 2) +
          Math.pow(mcParticle.momentum.z, 2)
      );
      mcParticle.momentum = Math.round(mcParticle.momentum * 100) / 100;
      mcParticle.vertex = Math.sqrt(
        Math.pow(mcParticle.vertex.x, 2) +
          Math.pow(mcParticle.vertex.y, 2) +
          Math.pow(mcParticle.vertex.z, 2)
      );
      mcParticle.vertex = Math.round(mcParticle.vertex * 100) / 100;

      mcParticle.time = Math.round(mcParticle.time * 100) / 100;
      mcParticle.mass = Math.round(mcParticle.mass * 100) / 100;
    }
  }

  static filter({ collection }, filteredObjects, criteriaFunction) {
    for (const mcParticle of collection) {
      if (!criteriaFunction(mcParticle)) {
        const parentParticles = mcParticle.oneToManyRelations["parents"]
          .map((link) => link.from)
          .filter((parent) => criteriaFunction(parent));
        const childrenParticles = mcParticle.oneToManyRelations["daughters"]
          .map((link) => link.to)
          .filter((child) => criteriaFunction(child));

        for (const parent of parentParticles) {
          for (const child of childrenParticles) {
            const linkToParent = new linkTypes["parents"](child, parent);

            const linkToChild = new linkTypes["daughters"](parent, child);

            filteredObjects["edm4hep::MCParticle"].oneToMany["parents"].push(
              linkToParent
            );
            filteredObjects["edm4hep::MCParticle"].oneToMany["daughters"].push(
              linkToChild
            );
          }
        }
      } else {
        filteredObjects["edm4hep::MCParticle"].collection.push(mcParticle);

        for (const link of mcParticle.oneToManyRelations["parents"]) {
          if (criteriaFunction(link.from)) {
            filteredObjects["edm4hep::MCParticle"].oneToMany["parents"].push(
              link
            );
          }
        }

        for (const link of mcParticle.oneToManyRelations["daughters"]) {
          if (criteriaFunction(link.to)) {
            filteredObjects["edm4hep::MCParticle"].oneToMany["daughters"].push(
              link
            );
          }
        }
      }
    }
  }
}

class ReconstructedParticle extends EDMObject {
  constructor() {
    super();
    this.width = 140;
    this.height = 190;
    this.color = "#fbffdf";
    this.radius = 30;
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    super.draw(ctx);

    const topY = this.y + 1.5 * TOP_MARGIN;
    const lines = [];

    lines.push("ID: " + this.index);

    const x = parseInt(this.momentum.x * 100) / 100;
    const y = parseInt(this.momentum.y * 100) / 100;
    const z = parseInt(this.momentum.z * 100) / 100;
    lines.push(`p = (x=${x},`);
    lines.push(`y=${y},`);
    lines.push(`z=${z}) GeV`);

    const energy = parseInt(this.energy * 100) / 100;
    lines.push("e = " + energy + " GeV");

    lines.push(parseCharge(this.charge));

    drawTextLines(ctx, lines, boxCenterX, topY, 23);
  }

  static setup(recoCollection) {}

  static filter() {}
}

class Cluster extends EDMObject {
  constructor() {
    super();
    this.width = 140;
    this.height = 170;
    this.color = "#ffe8df";
    this.radius = 20;
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    super.draw(ctx);

    const topY = this.y + TOP_MARGIN;
    const lines = [];
    lines.push("ID: " + this.index);
    lines.push("type: " + this.type);
    const energy = parseInt(this.energy * 100) / 100;
    lines.push("e = " + energy + " GeV");
    const x = parseInt(this.position.x * 100) / 100;
    const y = parseInt(this.position.y * 100) / 100;
    const z = parseInt(this.position.z * 100) / 100;
    lines.push(`pos = (x=${x},`);
    lines.push(`y=${y},`);
    lines.push(`z=${z}) mm`);

    drawTextLines(ctx, lines, boxCenterX, topY, 23);
  }

  static setup(clusterCollection) {}
}

class Track extends EDMObject {
  constructor() {
    super();
    this.width = 140;
    this.height = 150;
    this.color = "#fff6df";
    this.radius = 25;
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    super.draw(ctx);

    const topY = this.y + TOP_MARGIN;

    const lines = [];
    lines.push("ID: " + this.index);
    lines.push("type: " + this.type);
    const chi2 = parseInt(this.chi2 * 100) / 100;
    const ndf = parseInt(this.ndf * 100) / 100;
    const chiNdf = `${chi2}/${ndf}`;
    lines.push("chi2/ndf = " + chiNdf);
    lines.push("dEdx = " + this.dEdx);

    const trackerHitsCount = this.oneToManyRelations["trackerHits"].length;
    lines.push("tracker hits: " + trackerHitsCount);

    drawTextLines(ctx, lines, boxCenterX, topY, 23);
  }

  static setup(trackCollection) {}
}

class ParticleID extends EDMObject {
  constructor() {
    super();
    this.width = 140;
    this.height = 140;
    this.color = "#c9edf7";
    this.radius = 25;
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    super.draw(ctx);

    const topY = this.y + TOP_MARGIN;

    const lines = [];
    lines.push("ID: " + this.index);
    lines.push("type: " + this.type);
    lines.push("PDG: " + this.PDG);
    lines.push("algorithm: " + this.algorithmType);
    lines.push("likelihood: " + this.likelihood);

    drawTextLines(ctx, lines, boxCenterX, topY, 23);
  }

  static setup(particleIDCollection) {}
}

class Vertex extends EDMObject {
  constructor() {
    super();
    this.width = 140;
    this.height = 150;
    this.color = "#f5d3ef";
    this.radius = 25;
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    super.draw(ctx);

    const topY = this.y + TOP_MARGIN;

    const lines = [];
    lines.push("ID: " + this.index);
    const x = parseInt(this.position.x * 100) / 100;
    const y = parseInt(this.position.y * 100) / 100;
    const z = parseInt(this.position.z * 100) / 100;
    lines.push(`pos = (x=${x},`);
    lines.push(`y=${y},`);
    lines.push(`z=${z}) mm`);
    const chi2 = parseInt(this.chi2 * 100) / 100;
    const ndf = parseInt(this.ndf * 100) / 100;
    const chiNdf = `${chi2}/${ndf}`;
    lines.push("chi2/ndf = " + chiNdf);

    drawTextLines(ctx, lines, boxCenterX, topY, 23);
  }

  static setup(vertexCollection) {}
}

export const objectTypes = {
  "edm4hep::MCParticle": MCParticle,
  "edm4hep::ReconstructedParticle": ReconstructedParticle,
  "edm4hep::Cluster": Cluster,
  "edm4hep::Track": Track,
  "edm4hep::ParticleID": ParticleID,
  "edm4hep::Vertex": Vertex,
};
