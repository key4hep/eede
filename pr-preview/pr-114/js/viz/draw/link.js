import { Graphics } from "pixi.js";
import { getApp, getContainer } from "../../state/pixi-state.js";
import { getLinkColor } from "../../lib/utils/getLinkColor.js";

function fromPoints(box) {
  return [box.x + box.width / 2, box.y + box.height];
}

function toPoints(boxFrom, boxTo) {
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
  return [cpFromX, cpFromY, cpToX, cpToY, toX, toY];
}

function bezierCurve({
  fromX,
  fromY,
  cpFromX,
  cpFromY,
  cpToX,
  cpToY,
  toX,
  toY,
  color,
}) {
  const curve = new Graphics();
  curve.moveTo(fromX, fromY);
  curve.bezierCurveTo(cpFromX, cpFromY, cpToX, cpToY, toX, toY);
  curve.stroke({ width: 2, color });
  curve.cullable = true;
  return curve;
}

function computeCurve(link, from, to, color) {
  const [fromX, fromY] = fromPoints(from);
  const [cpFromX, cpFromY, cpToX, cpToY, toX, toY] = toPoints(from, to);
  return bezierCurve({
    fromX: fromX + link.xShift,
    fromY,
    cpFromX: cpFromX + link.xShift,
    cpFromY,
    cpToX: cpToX + link.xShift,
    cpToY,
    toX: toX + link.xShift,
    toY,
    color,
  });
}

export function redrawLink(link, color) {
  const container = getContainer();
  if (link.renderedLink?.parent) {
    container.removeChild(link.renderedLink);
  }
  const [from, to] = link.reverse ? [link.to, link.from] : [link.from, link.to];
  link.renderedLink = computeCurve(link, from, to, color);
  container.addChild(link.renderedLink);
}

export function drawBezierLink(link, reverse = false) {
  link.reverse = reverse;

  const app = getApp();
  const container = getContainer();

  const [from, to] = reverse ? [link.to, link.from] : [link.from, link.to];

  link.renderedLink = computeCurve(link, from, to, link.color);

  const boxFrom = from.renderedBox;
  const boxTo = to.renderedBox;

  const boxFromOnMove = () => {
    container.removeChild(link.renderedLink);
    link.renderedLink = computeCurve(link, from, to, getLinkColor(link));
    container.addChild(link.renderedLink);
  };

  boxFrom.on("pointerdown", () => {
    app.stage.on("pointermove", boxFromOnMove);
  });
  app.stage.on("pointerup", () => {
    app.stage.off("pointermove", boxFromOnMove);
  });
  app.stage.on("pointerupoutside", () => {
    app.stage.off("pointermove", boxFromOnMove);
  });

  const boxToOnMove = () => {
    container.removeChild(link.renderedLink);
    link.renderedLink = computeCurve(link, from, to, getLinkColor(link));
    container.addChild(link.renderedLink);
  };

  boxTo.on("pointerdown", () => {
    app.stage.on("pointermove", boxToOnMove);
  });
  app.stage.on("pointerup", () => {
    app.stage.off("pointermove", boxToOnMove);
  });
  app.stage.on("pointerupoutside", () => {
    app.stage.off("pointermove", boxToOnMove);
  });

  container.addChild(link.renderedLink);
}
