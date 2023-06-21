export function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

export function drawCross(ctx, x, y, color = "#F00") {
  const crossLenght = 6;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - crossLenght, y - crossLenght);
  ctx.lineTo(x + crossLenght, y + crossLenght);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + crossLenght, y - crossLenght);
  ctx.lineTo(x - crossLenght, y + crossLenght);
  ctx.stroke();
  ctx.restore();
}

export function drawRoundedRect(ctx, x, y, width, height, fillColor) {
  ctx.save();

  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 15);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 15);
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
  ctx.drawImage(texImg,
                x - tempWidth / 2, y - tempHeight / 2,
                tempWidth, tempHeight);
  ctx.restore();
}
