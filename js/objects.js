import { drawTex, drawRoundedRect } from "./graphic-primitives.js";

export class InfoBox {
  constructor(id) {
    this.id = parseInt(id);

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

    // Physics data
    this.name = "";
    this.momentum = 0.;  // GeV
    this.px = 0.;  // GeV
    this.py = 0.;  // GeV
    this.pz = 0.;  // GeV
    this.vertex = 0.;  // mm, distance from 0, 0, 0
    this.vx = 0.;  // mm
    this.vy = 0.;  // mm
    this.vz = 0.;  // mm
    this.time = 0.;  // ns
    this.mass = 0.;  // GeV
    this.charge = 0;  // e
    this.pdg = 0;
    this.genStatus = 0;
    this.simStatus = 0;
    this.parents = [];
    this.children = [];

    this.parentLinks = [];
    this.childrenLinks = [];
  }

  updateTexImg() {
    let svg = MathJax.tex2svg(this.name).firstElementChild;

    this.texImg = document.createElement('img');
    this.texImg.src = 'data:image/svg+xml;base64,' +
                      btoa('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
                           svg.outerHTML);
  }

  draw(ctx) {
    // drawCross(ctx, this.x, this.y);

    const boxCenterX = this.x + this.width / 2;

    drawRoundedRect(ctx,
                    this.x, this.y, this.width, this.height,
                    "#f5f5f5");


    drawTex(ctx,
            boxCenterX, this.y + this.height * .4,
            this.texImg, this.width);

    const topY = this.y + 20;
    const topLines = [];
    topLines.push("ID: " + this.id);
    topLines.push("Gen. stat.: " + this.genStatus);
    topLines.push("Sim. stat.: " + this.simStatus);

    const bottomY = this.y + this.height * 0.6;
    const bottomLines = [];
    bottomLines.push("p = " + this.momentum + " GeV");
    bottomLines.push("d = " + this.vertex + " mm");
    bottomLines.push("t = " + this.time + " ns");
    bottomLines.push("m = " + this.mass + " GeV");
    bottomLines.push("q = " + this.charge + " e");

    ctx.save();
    ctx.font = "16px sans-serif";
    for (const [i, lineText] of topLines.entries()) {
      ctx.fillText(lineText,
                   boxCenterX - ctx.measureText(lineText).width / 2,
                   topY + i * 23);
    }

    for (const [i, lineText] of bottomLines.entries()) {
      ctx.fillText(lineText,
                   boxCenterX - ctx.measureText(lineText).width/2,
                   bottomY + i * 22);
    }
    ctx.restore();
  }

  isHere(mouseX, mouseY) {
    if (mouseX > this.x && mouseX < (this.x + this.width) &&
        mouseY > this.y && mouseY < (this.y + this.height)) {
      return true;
    }

    return false;
  }

  isVisible(x, y, width, height) {
    if (x + width > this.x && x < this.x + this.width &&
        y + height > this.y && y < this.y + this.height) {
      return true;
    }

    return false;
  }
}


export class Link {
  constructor(id, boxFrom, boxTo) {
    this.id = parseInt(id);
    this.from = boxFrom;
    this.to = boxTo;
    this.color = "#A00";
    this.xShift = 0;
  }

  draw(ctx, infoBoxes) {
    const boxFrom = infoBoxes[this.from];
    const boxTo = infoBoxes[this.to];

    const fromX = boxFrom.x + boxFrom.width / 2;
    const fromY = boxFrom.y + boxFrom.height;
    const toX = boxTo.x + boxTo.width / 2;
    const toY = boxTo.y;

    if (toY > fromY) {
      var cpFromY = (toY - fromY) / 2 + fromY;
      var cpToY = cpFromY;
    } else {
      cpFromY = (fromY - toY) / 2 + fromY;
      cpToY = toY - (fromY - toY) / 2;
    }

    if (toX > fromX) {
      var cpFromX = (toX - fromX) / 4 + fromX;
      var cpToX = 3 * (toX - fromX) / 4 + fromX;
    } else {
      cpFromX = 3 * (fromX - toX) / 4 + toX;
      cpToX = (fromX - toX) / 4 + toX;
    }

    /*
    drawCross(ctx, fromX, fromY, "blue");
    drawCross(ctx, toX, toY, "green");
    drawCross(ctx, cpFromX, cpFromY, "yellow");
    drawLine(ctx, fromX, fromY, cpFromX, cpFromY, "yellow")
    drawCross(ctx, cpToX, cpToY, "orange");
    drawLine(ctx, toX, toY, cpToX, cpToY, "orange")
    */

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX + this.xShift, fromY);
    ctx.bezierCurveTo(cpFromX + this.xShift, cpFromY,
                      cpToX + this.xShift, cpToY,
                      toX + this.xShift, toY);
    ctx.stroke();
    ctx.restore();

    /*
    ctx.save();
    ctx.font = "14px sans-serif";
    ctx.fillStyle = this.color;
    const idText = "ID: " + this.id;
    ctx.fillText(idText,
                 cpToX, cpToY);
    ctx.restore();
    */
  }

  isVisible(x, y, width, height, infoBoxes) {
    const boxFrom = infoBoxes[this.from];
    const boxTo = infoBoxes[this.to];

    const fromX = boxFrom.x + boxFrom.width / 2;
    const fromY = boxFrom.y + boxFrom.height;
    const toX = boxTo.x + boxTo.width / 2;
    const toY = boxTo.y;

    const boxX = Math.min(fromX, toX);
    const boxWidth = Math.abs(fromX - toX);
    const boxY = Math.min(fromY, toY);
    const boxHeight = Math.abs(fromY - toY);

    /*
    console.log("boxX: ", this.boxX);
    console.log("boxY: ", this.boxY);
    console.log("boxWidth: ", this.boxWidth);
    console.log("boxHeight: ", this.boxHeight);
    */

    if (x + width > boxX && x < boxX + boxWidth &&
        y + height > boxY && y < boxY + boxHeight) {
      return true;
    }

    return false;
  }
}
