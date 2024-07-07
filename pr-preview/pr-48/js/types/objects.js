import {
  drawTex,
  drawRoundedRect,
  drawTextLines,
} from "../lib/graphic-primitives.js";
import { getName } from "../lib/getName.js";
import { linkTypes } from "./links.js";
import { parseCharge } from "../lib/parseCharge.js";

class EDMObject {
  constructor() {
    this.x = NaN;
    this.y = NaN;
    this.index = NaN;
    this.collectionId = NaN;
    this.width = 120;
    this.height = 240;
    this.lineColor = "black";
    this.lineWidth = 2;
    this.color = "white";
  }

  draw(ctx) {}

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
}

export class MCParticle extends EDMObject {
  constructor() {
    super();

    this.row = -1;

    this.texImg = null;
  }

  updateTexImg(text) {
    let svg = MathJax.tex2svg(text).firstElementChild;

    this.texImg = document.createElement("img");
    this.texImg.src =
      "data:image/svg+xml;base64," +
      btoa(
        '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
          svg.outerHTML
      );
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    drawRoundedRect(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      "#dff6ff",
      15
    );

    if (this.texImg.complete) {
      drawTex(
        ctx,
        boxCenterX,
        this.y + this.height * 0.4,
        this.texImg,
        this.width
      );
    } else {
      this.texImg.onload = () => {
        drawTex(
          ctx,
          boxCenterX,
          this.y + this.height * 0.4,
          this.texImg,
          this.width
        );
      };
    }

    const topY = this.y + 20;
    const topLines = [];
    topLines.push("ID: " + this.index);
    topLines.push("Gen. stat.: " + this.generatorStatus);
    topLines.push("Sim. stat.: " + this.simulatorStatus);

    const bottomY = this.y + this.height * 0.6;
    const bottomLines = [];
    bottomLines.push("p = " + this.momentum + " GeV");
    bottomLines.push("d = " + this.vertex + " mm");
    bottomLines.push("t = " + this.time + " ns");
    bottomLines.push("m = " + this.mass + " GeV");
    bottomLines.push(parseCharge(this.charge));

    drawTextLines(ctx, topLines, boxCenterX, topY, 23);

    drawTextLines(ctx, bottomLines, boxCenterX, bottomY, 22);
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
      mcParticle.updateTexImg(name);
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
    this.height = 180;
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    drawRoundedRect(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      "#fbffdf",
      30
    );

    const topY = this.y + 20;
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
    this.height = 180;
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    drawRoundedRect(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      "#ffe8df",
      20
    );

    const topY = this.y + 20;
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
    this.height = 180;
  }

  draw(ctx) {
    const boxCenterX = this.x + this.width / 2;

    drawRoundedRect(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      "#fff6df",
      25
    );

    const topY = this.y + 20;

    const lines = [];
    lines.push("ID: " + this.index);
    lines.push("type: " + this.type);
    const chi2 = parseInt(this.chi2 * 100) / 100;
    const ndf = parseInt(this.ndf * 100) / 100;
    const chiNdf = `${chi2} / ${ndf}`;
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
  }
}

class Vertex extends EDMObject {
  constructor() {
    super();
  }
}

export const objectTypes = {
  "edm4hep::MCParticle": MCParticle,
  "edm4hep::ReconstructedParticle": ReconstructedParticle,
  "edm4hep::Cluster": Cluster,
  "edm4hep::Track": Track,
  "edm4hep::ParticleID": ParticleID,
  "edm4hep::Vertex": Vertex,
};
