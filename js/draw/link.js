import { Graphics } from "../pixi.min.mjs";
import { getApp, getContainer } from "./app.js";

function fromPoints(boxFrom) {
  return [boxFrom.x + boxFrom.width / 2, boxFrom.y + boxFrom.height];
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

export function drawBezierLink(link, reverse = false) {
  const app = getApp();
  const container = getContainer();

  if (!reverse) {
    const [fromX, fromY] = fromPoints(link.from);
    const [cpFromX, cpFromY, cpToX, cpToY, toX, toY] = toPoints(
      link.from,
      link.to
    );

    let curve = bezierCurve({
      fromX: fromX + link.xShift,
      fromY: fromY,
      cpFromX: cpFromX + link.xShift,
      cpFromY: cpFromY,
      cpToX: cpToX + link.xShift,
      cpToY: cpToY,
      toX: toX + link.xShift,
      toY: toY,
      color: link.color,
    });

    link.renderedLink = curve;

    const boxFrom = link.from.renderedBox;
    const boxTo = link.to.renderedBox;

    const boxFromOnMove = () => {
      container.removeChild(curve);
      const [fromX, fromY] = fromPoints(link.from);
      const [cpFromX, cpFromY, cpToX, cpToY, toX, toY] = toPoints(
        link.from,
        link.to
      );
      curve = bezierCurve({
        fromX: fromX + link.xShift,
        fromY: fromY,
        cpFromX: cpFromX + link.xShift,
        cpFromY: cpFromY,
        cpToX: cpToX + link.xShift,
        cpToY: cpToY,
        toX: toX + link.xShift,
        toY: toY,
        color: link.color,
      });
      link.renderedLink = curve;
      link.renderedLink.renderable = link.isVisible();
      container.addChild(curve);
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
      container.removeChild(curve);
      const [fromX, fromY] = fromPoints(link.from);
      const [cpFromX, cpFromY, cpToX, cpToY, toX, toY] = toPoints(
        link.from,
        link.to
      );
      curve = bezierCurve({
        fromX: fromX + link.xShift,
        fromY: fromY,
        cpFromX: cpFromX + link.xShift,
        cpFromY: cpFromY,
        cpToX: cpToX + link.xShift,
        cpToY: cpToY,
        toX: toX + link.xShift,
        toY: toY,
        color: link.color,
      });
      link.renderedLink = curve;
      link.renderedLink.renderable = link.isVisible();
      container.addChild(curve);
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

    container.addChild(curve);
  } else {
    const [fromX, fromY] = fromPoints(link.to);
    const [cpFromX, cpFromY, cpToX, cpToY, toX, toY] = toPoints(
      link.to,
      link.from
    );

    let curve = bezierCurve({
      fromX: fromX + link.xShift,
      fromY: fromY,
      cpFromX: cpFromX + link.xShift,
      cpFromY: cpFromY,
      cpToX: cpToX + link.xShift,
      cpToY: cpToY,
      toX: toX + link.xShift,
      toY: toY,
      color: link.color,
    });

    link.renderedLink = curve;

    const boxFrom = link.to.renderedBox;
    const boxTo = link.from.renderedBox;

    const boxFromOnMove = () => {
      container.removeChild(curve);
      const [fromX, fromY] = fromPoints(link.to);
      const [cpFromX, cpFromY, cpToX, cpToY, toX, toY] = toPoints(
        link.to,
        link.from
      );
      curve = bezierCurve({
        fromX: fromX + link.xShift,
        fromY: fromY,
        cpFromX: cpFromX + link.xShift,
        cpFromY: cpFromY,
        cpToX: cpToX + link.xShift,
        cpToY: cpToY,
        toX: toX + link.xShift,
        toY: toY,
        color: link.color,
      });
      link.renderedLink = curve;
      link.renderedLink.renderable = link.isVisible();
      container.addChild(curve);
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
      container.removeChild(curve);
      const [fromX, fromY] = fromPoints(link.to);
      const [cpFromX, cpFromY, cpToX, cpToY, toX, toY] = toPoints(
        link.to,
        link.from
      );
      curve = bezierCurve({
        fromX: fromX + link.xShift,
        fromY: fromY,
        cpFromX: cpFromX + link.xShift,
        cpFromY: cpFromY,
        cpToX: cpToX + link.xShift,
        cpToY: cpToY,
        toX: toX + link.xShift,
        toY: toY,
        color: link.color,
      });
      link.renderedLink = curve;
      link.renderedLink.renderable = link.isVisible();
      container.addChild(curve);
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

    container.addChild(curve);
  }
}
