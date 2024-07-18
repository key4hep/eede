import { Graphics } from "../pixi.min.mjs";

export function addBox(app, box) {
  const boxGraphic = new Graphics();
  boxGraphic.rect(box.x, box.y, box.width, box.height);
  boxGraphic.fill(box.color);
  app.stage.addChild(boxGraphic);
}
