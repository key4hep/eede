import { Rectangle } from "../pixi.min.mjs";

export function setRenderable(objects) {
  for (const { collection, oneToMany, oneToOne } of Object.values(
    objects.datatypes
  )) {
    for (const object of collection) {
      const renderedBox = object.renderedBox;

      renderedBox.cullArea = new Rectangle(
        renderedBox.position.x,
        renderedBox.position.y,
        renderedBox.width,
        renderedBox.height
      );

      renderedBox.renderable = object.isVisible();
    }

    for (const links of Object.values(oneToMany)) {
      for (const link of links) {
        link.renderedLink.renderable = link.isVisible();
      }
    }

    for (const links of Object.values(oneToOne)) {
      for (const link of links) {
        link.renderedLink.renderable = link.isVisible();
      }
    }
  }

  for (const associations of Object.values(objects.associations)) {
    for (const association of associations) {
      association.renderedLink.renderable = association.isVisible();
    }
  }
}
