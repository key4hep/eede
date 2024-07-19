import { Graphics } from "../pixi.min.mjs";
import { getContainer } from "./app.js";

export function drawBezierLink(link) {
  const curve = new Graphics();

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

  curve.moveTo(fromX + link.xShift, fromY);
  curve.bezierCurveTo(
    cpFromX + link.xShift,
    cpFromY,
    cpToX + link.xShift,
    cpToY,
    toX + link.xShift,
    toY
  );
  curve.stroke({ width: 2, color: link.color });

  const container = getContainer();
  container.addChild(curve);
}
