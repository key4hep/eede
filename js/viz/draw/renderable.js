import { Rectangle } from "pixi.js";
import { redrawBox } from "./box.js";
import { redrawLink } from "./link.js";
import { filteredOut } from "../types/vizStyles.js";

function updateLinkColor(link) {
  const filtered = link.from.filteredOut || link.to.filteredOut;
  const color = filtered ? filteredOut.linkColor : link.color;

  link.renderedLink.alpha = filtered ? 0.5 : 1;

  redrawLink(link, color);
}

function updateBoxColors(object) {
  object.renderedBox.alpha = object.filteredOut ? 0.5 : 1;

  if (object.filteredOut) {
    redrawBox(object, filteredOut.color, filteredOut.lineColor);
  } else {
    redrawBox(object, object.color, object.lineColor);
  }
}

export function setRenderable(objects) {
  for (const { collection, oneToMany, oneToOne } of Object.values(
    objects.datatypes,
  )) {
    for (const object of collection) {
      const renderedBox = object.renderedBox;

      renderedBox.cullArea = new Rectangle(
        renderedBox.position.x,
        renderedBox.position.y,
        renderedBox.width,
        renderedBox.height,
      );

      updateBoxColors(object);
    }

    for (const links of Object.values(oneToMany)) {
      for (const link of links) {
        updateLinkColor(link);
      }
    }

    for (const links of Object.values(oneToOne)) {
      for (const link of links) {
        updateLinkColor(link);
      }
    }
  }

  for (const associations of Object.values(objects.associations)) {
    for (const association of associations) {
      updateLinkColor(association);
    }
  }
}
