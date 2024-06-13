import { EDMObject } from "./edmobject.js";
import { drawTex, drawRoundedRect } from "../graphic-primitives.js";
import { getName } from "../tools.js";

export class Cluster extends EDMObject {
  constructor(id) {
    super(id);
  }
}

export class ParticleID extends EDMObject {
  constructor(id) {
    super(id);
  }
}

export class ReconstructedParticle extends EDMObject {
  constructor(id) {
    super(id);
  }
}

export class Vertex extends EDMObject {
  constructor(id) {
    super(id);
  }
}

export class Track extends EDMObject {
  constructor(id) {
    super(id);
  }
}

export class MCParticle extends EDMObject {
  constructor(id) {
    super(id);

    // Appearance
    this.x = 0;
    this.y = 0;
    this.width = 120;
    this.height = 240;
    this.lineColor = "black";
    this.lineWidth = 2;
    this.color = "white";
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
    // drawCross(ctx, this.x, this.y);

    const boxCenterX = this.x + this.width / 2;

    drawRoundedRect(ctx, this.x, this.y, this.width, this.height, "#f5f5f5");

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

    const {
      generatorStatus,
      simulatorStatus,
      momentum,
      vertex,
      time,
      mass,
      charge,
    } = this.members;

    const topY = this.y + 20;
    const topLines = [];
    topLines.push("ID: " + this.id);
    topLines.push("Gen. stat.: " + generatorStatus);
    topLines.push("Sim. stat.: " + simulatorStatus);

    const bottomY = this.y + this.height * 0.6;
    const bottomLines = [];
    let moment = Math.sqrt(momentum.x ** 2 + momentum.y ** 2 + momentum.z ** 2);
    moment = Math.round(moment * 100) / 100;
    bottomLines.push("p = " + moment + " GeV");
    let v = Math.sqrt(vertex.x ** 2 + vertex.y ** 2 + vertex.z ** 2);
    v = Math.round(v * 100) / 100;
    bottomLines.push("d = " + v + " mm");
    const t = Math.round(time * 100) / 100;
    bottomLines.push("t = " + t + " ns");
    let m = Math.round(mass * 100) / 100;
    bottomLines.push("m = " + m + " GeV");
    if (Math.abs(charge) < 1.0 && charge != 0) {
      if (Math.round(charge * 1000) === 667) {
        bottomLines.push("q = 2/3 e");
      }
      if (Math.round(charge * 1000) === -667) {
        bottomLines.push("q = -2/3 e");
      }
      if (Math.round(charge * 1000) === 333) {
        bottomLines.push("q = 1/3 e");
      }
      if (Math.round(charge * 1000) === -333) {
        bottomLines.push("q = -1/3 e");
      }
    } else {
      bottomLines.push("q = " + charge + " e");
    }

    ctx.save();
    ctx.font = "16px sans-serif";
    for (const [i, lineText] of topLines.entries()) {
      ctx.fillText(
        lineText,
        boxCenterX - ctx.measureText(lineText).width / 2,
        topY + i * 23
      );
    }

    for (const [i, lineText] of bottomLines.entries()) {
      ctx.fillText(
        lineText,
        boxCenterX - ctx.measureText(lineText).width / 2,
        bottomY + i * 22
      );
    }
    ctx.restore();
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
}

export const objectTypes = {
  "edm4hep::Cluster": Cluster,
  "edm4hep::ParticleID": ParticleID,
  "edm4hep::ReconstructedParticle": ReconstructedParticle,
  "edm4hep::Vertex": Vertex,
  "edm4hep::Track": Track,
  "edm4hep::MCParticle": MCParticle,
};
