import { Rectangle } from "pixi.js";
import { redrawBox } from "./box.js";
import { redrawLink } from "./link.js";
import { filteredOut } from "../../lib/constants/vizStyles.js";
import { getLinkColor } from "../../lib/utils/getLinkColor.js";

function updateBoxColors(object) {
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
        redrawLink(link, getLinkColor(link));
      }
    }

    for (const links of Object.values(oneToOne)) {
      for (const link of links) {
        redrawLink(link, getLinkColor(link));
      }
    }
  }

  for (const associations of Object.values(objects.associations)) {
    for (const association of associations) {
      redrawLink(association, getLinkColor(association));
    }
  }
}
