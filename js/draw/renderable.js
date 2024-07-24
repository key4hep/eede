import { Rectangle } from "../pixi.min.mjs";

export function setRenderable(objects) {
  for (const { collection } of Object.values(objects.datatypes)) {
    for (const object of collection) {
      const renderedBox = object.renderedBox;
      renderedBox.cullArea = new Rectangle(
        renderedBox.x,
        renderedBox.y,
        renderedBox.width,
        renderedBox.height
      );

      renderedBox.renderable = object.isVisible();
    }
  }
}
