export function drawRoundedRect(ctx, x, y, width, height, fillColor, radius) {
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

export function drawTex(ctx, x, y, texImg, maxWidth) {
  let scale = (maxWidth * 0.9) / texImg.naturalWidth;
  if (scale > 2) {
    scale = 2;
  }
  const tempHeight = texImg.naturalHeight * scale;
  const tempWidth = texImg.naturalWidth * scale;

  ctx.save();
  ctx.drawImage(
    texImg,
    x - tempWidth / 2,
    y - tempHeight / 2,
    tempWidth,
    tempHeight
  );
  ctx.restore();
}

export function drawTextLines(ctx, lines, boxCenterX, y, n) {
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

export function drawBezierLink(ctx, link) {
  const boxFrom = link.from;
  const boxTo = link.to;

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

  ctx.save();
  ctx.strokeStyle = link.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX + link.xShift, fromY);
  ctx.bezierCurveTo(
    cpFromX + link.xShift,
    cpFromY,
    cpToX + link.xShift,
    cpToY,
    toX + link.xShift,
    toY
  );
  ctx.stroke();
  ctx.restore();
}

export function drawStraightLink(ctx, link) {
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
