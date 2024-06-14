import { EDMObject } from "./edmobject.js";
import { drawTex, drawRoundedRect } from "../graphic-primitives.js";
import { getName } from "../lib/getName.js";
import { linkTypes } from "./links.js";

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

    const topY = this.y + 20;
    const topLines = [];
    topLines.push("ID: " + this.id);
    topLines.push("Gen. stat.: " + this.generatorStatus);
    topLines.push("Sim. stat.: " + this.simulatorStatus);

    const bottomY = this.y + this.height * 0.6;
    const bottomLines = [];
    bottomLines.push("p = " + this.momentum + " GeV");
    bottomLines.push("d = " + this.vertex + " mm");
    bottomLines.push("t = " + this.time + " ns");
    bottomLines.push("m = " + this.mass + " GeV");
    if (Math.abs(this.charge) < 1.0 && this.charge != 0) {
      if (Math.round(this.charge * 1000) === 667) {
        bottomLines.push("q = 2/3 e");
      }
      if (Math.round(this.charge * 1000) === -667) {
        bottomLines.push("q = -2/3 e");
      }
      if (Math.round(this.charge * 1000) === 333) {
        bottomLines.push("q = 1/3 e");
      }
      if (Math.round(this.charge * 1000) === -333) {
        bottomLines.push("q = -1/3 e");
      }
    } else {
      bottomLines.push("q = " + this.charge + " e");
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

  static setup(mcCollection, canvas) {
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

    const getMaxRow = (parentLinks) => {
      let maxRow = -1;
      for (const parentLink of parentLinks) {
        const parent = parentLink.from;
        if (parent.row === -1) {
          return -1;
        }

        if (parent.row > maxRow) {
          maxRow = parent.row;
        }
      }

      return maxRow;
    };

    let repeat = true;
    while (repeat) {
      repeat = false;
      for (const mcParticle of mcCollection) {
        if (mcParticle.row >= 0) {
          continue;
        }
        const parentRow = getMaxRow(mcParticle.oneToManyRelations["parents"]);
        if (parentRow >= 0) {
          mcParticle.row = parentRow + 1;
        } else {
          repeat = true;
        }
      }
    }

    const rows = mcCollection.map((obj) => {
      return obj.row;
    });
    const maxRow = Math.max(...rows);

    // Order infoBoxes into rows
    const mcRows = [];
    for (let i = 0; i <= maxRow; i++) {
      mcRows.push([]);
    }
    for (const box of mcCollection) {
      mcRows[box.row].push(box);
    }
    const rowWidths = mcRows.map((obj) => {
      return obj.length;
    });
    const maxRowWidth = Math.max(...rowWidths);

    const boxWidth = mcCollection[0].width;
    const boxHeight = mcCollection[0].height;
    const horizontalGap = boxWidth * 0.4;
    const verticalGap = boxHeight * 0.3;

    canvas.width =
      boxWidth * (maxRowWidth + 1) + horizontalGap * (maxRowWidth + 1);
    canvas.height = boxHeight * (maxRow + 1) + verticalGap * (maxRow + 2);

    for (const [i, row] of mcRows.entries()) {
      for (const [j, box] of row.entries()) {
        if (row.length % 2 === 0) {
          const distanceFromCenter = j - row.length / 2;
          if (distanceFromCenter < 0) {
            box.x =
              canvas.width / 2 -
              boxWidth -
              horizontalGap / 2 +
              (distanceFromCenter + 1) * boxWidth +
              (distanceFromCenter + 1) * horizontalGap;
          } else {
            box.x =
              canvas.width / 2 +
              horizontalGap / 2 +
              distanceFromCenter * boxWidth +
              distanceFromCenter * horizontalGap;
          }
        } else {
          const distanceFromCenter = j - row.length / 2;
          box.x =
            canvas.width / 2 -
            boxWidth / 2 +
            distanceFromCenter * boxWidth +
            distanceFromCenter * horizontalGap;
        }
        box.y = i * verticalGap + verticalGap + i * boxHeight;
      }
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

export const objectTypes = {
  "edm4hep::Cluster": Cluster,
  "edm4hep::ParticleID": ParticleID,
  "edm4hep::ReconstructedParticle": ReconstructedParticle,
  "edm4hep::Vertex": Vertex,
  "edm4hep::Track": Track,
  "edm4hep::MCParticle": MCParticle,
};
