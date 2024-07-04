import { canvas } from "../main.js";

// List 1:1 association in a vertical list
export function buildAssociationView(viewObjects, associationName) {
  const association = viewObjects.associations[associationName];

  const fromCollection = association.map((association) => association.from);
  const toCollection = association.map((association) => association.to);

  if (fromCollection.length === 0 || toCollection.length === 0) {
    alert("No association found!");
    return;
  }

  const fromWidth = fromCollection[0].width;
  const toWidth = toCollection[0].width;
  const fromHorizontalGap = 0.3 * fromWidth;
  const toHorizontalGap = 0.3 * toWidth;
  const gap = 2 * (fromWidth + toWidth);
  const totalWidth = gap + fromWidth + toWidth;

  canvas.width =
    totalWidth > window.innerWidth ? totalWidth : window.innerWidth;

  const width = canvas.width;

  const fromHeight = fromCollection[0].height;
  const toHeight = toCollection[0].height;
  const fromVerticalGap = 0.3 * fromHeight;
  const toVerticalGap = 0.3 * toHeight;

  const fromTotalHeight =
    fromCollection.length * (fromHeight + fromVerticalGap) + fromVerticalGap;
  const toTotalHeight =
    toCollection.length * (toHeight + toVerticalGap) + toVerticalGap;

  canvas.height =
    fromTotalHeight > toTotalHeight ? fromTotalHeight : toTotalHeight;

  const fromX = width / 2 - fromWidth - fromHorizontalGap;
  for (const [index, from] of fromCollection.entries()) {
    from.y = fromVerticalGap + index * (fromHeight + fromVerticalGap);
    from.x = fromX;
  }

  const toX = width / 2 + toHorizontalGap;
  for (const [index, to] of toCollection.entries()) {
    to.y = toVerticalGap + index * (toHeight + toVerticalGap);
    to.x = toX;
  }
}
