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

  const width = totalWidth > window.innerWidth ? totalWidth : window.innerWidth;
  canvas.width = width;

  const fromHeight = fromCollection[0].height;
  const toHeight = toCollection[0].height;

  const height = Math.max(fromHeight, toHeight);
  const verticalGap = 0.3 * height;

  const totalHeight =
    fromCollection.length * (height + verticalGap) + verticalGap;

  canvas.height = totalHeight;

  let accHeight = 0;

  const fromX = width / 2 - fromWidth - fromHorizontalGap;

  const toX = width / 2 + toHorizontalGap;

  for (let i = 0; i < fromCollection.length; i++) {
    fromCollection[i].x = fromX;
    toCollection[i].x = toX;

    const space = height + verticalGap;
    fromCollection[i].y = accHeight + space / 2 - fromHeight / 2;
    toCollection[i].y = accHeight + space / 2 - toHeight / 2;
    accHeight += height + verticalGap;
  }
}
