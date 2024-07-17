import { onDragStart } from "../pixi/events.js";
import { Graphics, BitmapText } from "../pixi/pixi.min.mjs";

export function drawRoundedRect(x, y, width, height, fillColor, radius) {
  ctx.save();

  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.stroke();
  ctx.restore();
}

export function drawObjectBox(
  app,
  { x, y, width, height, color, radius },
  lines,
  image
) {
  const box = new Graphics();
  box.lineStyle(2, 0x000000, 1);
  box.beginFill(color, 1);
  box.drawRect(x, y, width, height);
  box.endFill();
  app.stage.addChild(box);

  for (const [i, lineText] of lines.entries()) {
    const text = new BitmapText({
      text: lineText,
      style: {
        fontFamily: "sans-serif",
        fontSize: 16,
        fill: 0x000000,
        align: "center",
      },
    });

    box.addChild(text);
    text.x = x + width / 2 - text.width / 2;
    text.y = y + 20 + i * 20;
  }

  box.on("pointerdown", onDragStart, box);
}

export function drawTex(x, y, path, maxWidth) {
  // let scale = (maxWidth * 0.9) / texImg.naturalWidth;
  // if (scale > 2) {
  //   scale = 2;
  // }
  // const tempHeight = texImg.naturalHeight * scale;
  // const tempWidth = texImg.naturalWidth * scale;

  ctx.save();
  const pathImage = new Path2D(path);
  // ctx.drawImage(
  //   texImg,
  //   x - tempWidth / 2,
  //   y - tempHeight / 2,
  //   tempWidth,
  //   tempHeight
  // );
  ctx.translate(x, y);
  ctx.stroke(pathImage);
  ctx.restore();
}

export function drawTextLines(lines, boxCenterX, y, n) {
  ctx.save();
  ctx.font = "16px sans-serif";
  for (const [i, lineText] of lines.entries()) {
    ctx.fillText(
      lineText,
      boxCenterX - ctx.measureText(lineText).width / 2,
      y + i * n
    );
  }
  ctx.restore();
}

export function drawBezierLink(app, link) {
  const boxFrom = link.from;
  const boxTo = link.to;

  const fromX = boxFrom.x + boxFrom.width / 2;
  const fromY = boxFrom.y + boxFrom.height;
  const toX = boxTo.x + boxTo.width / 2;
  const toY = boxTo.y;

  let cpFromY, cpToY, cpFromX, cpToX;

  if (toY > fromY) {
    cpFromY = (toY - fromY) / 2 + fromY;
    cpToY = cpFromY;
  } else {
    cpFromY = (fromY - toY) / 2 + fromY;
    cpToY = toY - (fromY - toY) / 2;
  }

  if (toX > fromX) {
    cpFromX = (toX - fromX) / 4 + fromX;
    cpToX = (3 * (toX - fromX)) / 4 + fromX;
  } else {
    cpFromX = (3 * (fromX - toX)) / 4 + toX;
    cpToX = (fromX - toX) / 4 + toX;
  }

  const line = new Graphics();

  line.bezierCurveTo(
    cpFromX + link.xShift,
    cpFromY,
    cpToX + link.xShift,
    cpToY,
    toX + link.xShift,
    toY
  );
  line.stroke({ with: 2, color: 0x000000 });
  line.position.x = fromX + link.xShift;
  line.position.y = fromY;

  app.stage.addChild(line);

  // ctx.save();
  // ctx.strokeStyle = link.color;
  // ctx.lineWidth = 2;
  // ctx.beginPath();
  // ctx.moveTo(fromX + link.xShift, fromY);
  // ctx.bezierCurveTo(
  //   cpFromX + link.xShift,
  //   cpFromY,
  //   cpToX + link.xShift,
  //   cpToY,
  //   toX + link.xShift,
  //   toY
  // );
  // ctx.stroke();
  // ctx.restore();
}

export function drawStraightLink(link) {
  const boxFrom = link.from;
  const boxTo = link.to;

  const fromX = boxFrom.x + boxFrom.width / 2;
  const fromY = boxFrom.y + boxFrom.height / 2;

  const toX = boxTo.x + boxTo.width / 2;
  const toY = boxTo.y + boxTo.height / 2;

  ctx.save();
  ctx.strokeStyle = link.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.restore();
}
