import { Rectangle } from "../pixi.min.mjs";
import { getApp, getContainer } from "./app.js";

let currentObject;
let prevX, prevY;

export function dragStart(event) {
  const app = getApp();
  const container = getContainer();

  const renderedBox = this.renderedBox;

  prevX = container.toLocal(event.data.global).x;
  prevY = container.toLocal(event.data.global).y;

  renderedBox.zIndex = 2;
  currentObject = renderedBox;

  app.stage.on("pointermove", dragMove, this);
}

export function dragMove(event) {
  const container = getContainer();
  const renderedBox = this.renderedBox;

  const eventX = container.toLocal(event.data.global).x;
  const eventY = container.toLocal(event.data.global).y;

  const deltaX = eventX - prevX;
  const deltaY = eventY - prevY;

  this.x += deltaX;
  this.y += deltaY;
  renderedBox.position.x += deltaX;
  renderedBox.position.y += deltaY;

  renderedBox.cullArea = new Rectangle(
    renderedBox.position.x,
    renderedBox.position.y,
    renderedBox.width,
    renderedBox.height
  );

  prevX = eventX;
  prevY = eventY;
}

export function dragEnd() {
  if (currentObject) {
    currentObject.zIndex = 1;
  }
  const app = getApp();
  app.stage.off("pointermove", dragMove);
}
