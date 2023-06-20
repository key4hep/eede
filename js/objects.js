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
            this.texImg);

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

    this.fromX = 0;
    this.fromY = 0;
    this.toX = 0;
    this.toY = 0;

    this.boxX = 0;
    this.boxWidth = 0;
    this.boxY = 0;
    this.boxHeight = 0;
  }

  draw(ctx, infoBoxes) {
    const boxFrom = infoBoxes[this.from];
    const boxTo = infoBoxes[this.to];

    this.getEndpoints(infoBoxes);

    const linkLenght = Math.sqrt(Math.pow(this.fromX - this.toX, 2) +
                                 Math.pow(this.fromY - this.toY, 2));
    if (this.toX > this.fromX) {
      var cpFromX = this.fromX + Math.abs(this.fromX - this.toX) * linkLenght / window.innerWidth;
    } else {
      cpFromX = this.fromX - Math.abs(this.fromX - this.toX) * linkLenght / window.innerWidth;
    }
    const cpFromY = this.fromY + (boxFrom.height / 2) * linkLenght / window.innerHeight;
    if (this.toX > this.fromX) {
      var cpToX = this.toX - Math.abs(this.fromX - this.toX) * linkLenght / window.innerWidth;
    } else {
      cpToX = this.toX + Math.abs(this.fromX - this.toX) * linkLenght / window.innerWidth;
    }
    const cpToY = this.toY - (boxTo.height / 2) * linkLenght / window.innerHeight;

    /*
    drawCross(ctx, this.fromX, this.fromY, "blue");
    drawCross(ctx, this.toX, this.toY, "green");
    drawCross(ctx, cpFromX, cpFromY, "yellow");
    drawLine(ctx, this.fromX, this.fromY, cpFromX, cpFromY, "yellow")
    drawCross(ctx, cpToX, cpToY, "orange");
    drawLine(ctx, this.toX, this.toY, cpToX, cpToY, "orange")
    */

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.fromX, this.fromY);
    ctx.bezierCurveTo(cpFromX, cpFromY,
                      cpToX, cpToY,
                      this.toX, this.toY);
    ctx.stroke();

    /*
    ctx.font = "14px sans-serif";
    ctx.fillStyle = this.color;
    const idText = "ID: " + this.id;
    ctx.fillText(idText,
                 cpToX, cpToY);
    ctx.restore();
    */
  }

  getEndpoints(infoBoxes) {
    const boxFrom = infoBoxes[this.from];
    const boxTo = infoBoxes[this.to];

    this.fromX = boxFrom.x + boxFrom.width / 2;
    this.fromY = boxFrom.y + boxFrom.height;
    this.toX = boxTo.x + boxTo.width / 2;
    this.toY = boxTo.y;

    this.boxX = Math.min(this.fromX, this.toX);
    this.boxWidth = Math.abs(this.fromX - this.toX);
    this.boxY = Math.min(this.fromY, this.toY);
    this.boxHeight = Math.abs(this.fromY - this.toY);

    this.fromX += this.xShift;
    this.toX += this.xShift;
  }

  isVisible(x, y, width, height) {
    /*
    console.log("boxX: ", this.boxX);
    console.log("boxY: ", this.boxY);
    console.log("boxWidth: ", this.boxWidth);
    console.log("boxHeight: ", this.boxHeight);
    */

    if (x + width > this.boxX && x < this.boxX + this.boxWidth &&
        y + height > this.boxY && y < this.boxY + this.boxHeight) {
      return true;
    }

    return false;
  }
}
