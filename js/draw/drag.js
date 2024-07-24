import { Rectangle } from "../pixi.min.mjs";
import { getApp, getContainer } from "./app.js";

let currentObject;
let prevX, prevY;

export function dragStart(event) {
  const app = getApp();
  const container = getContainer();

  prevX = container.toLocal(event.data.global).x;
  prevY = container.toLocal(event.data.global).y;

  this.zIndex = 2;
  currentObject = this;

  app.stage.on("pointermove", dragMove, this);
}

export function dragMove(event) {
  const container = getContainer();

  const eventX = container.toLocal(event.data.global).x;
  const eventY = container.toLocal(event.data.global).y;

  const deltaX = eventX - prevX;
  const deltaY = eventY - prevY;

  this.position.x += deltaX;
  this.position.y += deltaY;

  this.cullArea = new Rectangle(
    this.position.x,
    this.position.y,
    this.width,
    this.height
  );

  prevX = eventX;
  prevY = eventY;
}

export function dragEnd() {
  currentObject.zIndex = 1;
  const app = getApp();
  app.stage.off("pointermove", dragMove);
}
