import { Graphics } from "../pixi.min.mjs";
import { pixi } from "./app.js";

export function addBox(box) {
  const { container } = pixi;
  const boxGraphic = new Graphics();
  boxGraphic.rect(box.x, box.y, box.width, box.height);
  boxGraphic.fill(box.color);
  container.addChild(boxGraphic);
  pixi.elements.push(boxGraphic);
}
