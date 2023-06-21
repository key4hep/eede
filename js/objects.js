import { drawLine, drawCross, drawTex, drawRoundedRect } from "./graphic-primitives.js";

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
    this.pdg = 0;
    this.genStatus = 0;
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
            boxCenterX, this.y + this.height * .35,
            this.texImg, this.width);

    ctx.save();
    ctx.font = "18px sans-serif";
    const momText = "p = " + Math.round(this.momentum * 100) / 100 + " GeV";
    ctx.fillText(momText,
                 boxCenterX - ctx.measureText(momText).width/2,
                 this.y + this.height * .65);

    const idText = "ID: " + this.id;
    ctx.fillText(idText,
                 boxCenterX - ctx.measureText(idText).width/2,
                 this.y + 20);
    const statusText = "Gen. stat.: " + this.genStatus;
    ctx.fillText(statusText,
                 boxCenterX - ctx.measureText(statusText).width/2,
                 this.y + 40);
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
