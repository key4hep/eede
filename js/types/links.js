export const colors = {
  "daughters": "#00AA00",
  "parents": "#AA0000",
  // more if needed
};

const hexCharacters = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

function getCharacter(index) {
  return hexCharacters[index];
}

export function generateRandomColor() {
  let hexColorRep = "#";

  for (let index = 0; index < 6; index++) {
    const randomPosition = Math.floor(Math.random() * hexCharacters.length);
    hexColorRep += getCharacter(randomPosition);
  }

  return hexColorRep;
}

export class Link {
  // we may create a specific class for each type if needed
  constructor(from, to) {
    this.from = from;
    this.to = to;
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
      var cpToX = (3 * (toX - fromX)) / 4 + fromX;
    } else {
      cpFromX = (3 * (fromX - toX)) / 4 + toX;
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
    ctx.bezierCurveTo(
      cpFromX + this.xShift,
      cpFromY,
      cpToX + this.xShift,
      cpToY,
      toX + this.xShift,
      toY
    );
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

    return (
      x + width > boxX &&
      x < boxX + boxWidth &&
      y + height > boxY &&
      y < boxY + boxHeight
    );
  }
}

export function createLink(id, from, { collectionID, index }) {
  return new Link(id, from, index, collectionID);
}
