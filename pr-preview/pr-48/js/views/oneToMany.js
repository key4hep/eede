import { canvas } from "../main.js";

// One to Many relation between two collections
export function oneToManyView(
  viewCurrentObjects,
  fromCollectionName,
  toCollectionName,
  relationName
) {
  const fromCollection =
    viewCurrentObjects.datatypes[fromCollectionName].collection;

  const toCollection =
    viewCurrentObjects.datatypes[toCollectionName].collection;

  if (fromCollection.length === 0 || toCollection.length === 0) {
    alert("No association found!");
    return;
  }

  const fromWidth = fromCollection[0].width;
  const fromHeight = fromCollection[0].height;
  const fromVerticalGap = 0.3 * fromHeight;
  const fromHorizontalGap = 0.3 * fromWidth;

  const toWidth = toCollection[0].width;
  const toHeight = toCollection[0].height;
  const toVerticalGap = 0.3 * toHeight;
  const toHorizontalGap = 0.3 * toWidth;

  const gap = 2 * (fromWidth + toWidth);
  const totalWidth = gap + fromWidth + toWidth;

  const fromTotalHeight =
    fromCollection.length * (fromHeight + fromVerticalGap) + fromVerticalGap;

  const toTotalHeight =
    toCollection.length * (toHeight + toVerticalGap) + toVerticalGap;

  canvas.height =
    fromTotalHeight > toTotalHeight ? fromTotalHeight : toTotalHeight;

  canvas.width =
    totalWidth > window.innerWidth ? totalWidth : window.innerWidth;

  const width = canvas.width;

  const fromX = width / 2 - fromWidth - fromHorizontalGap;
  const toX = width / 2 + toHorizontalGap;

  let toCount = 0;

  fromCollection.forEach((fromObject) => {
    const objectRelations = fromObject.oneToManyRelations[relationName];
    const length = objectRelations.length;

    objectRelations.forEach((relation) => {
      const toObject = relation.to;

      toObject.x = toX;
      toObject.y = toVerticalGap + toCount * (toHeight + toVerticalGap);
      toCount++;
    });

    fromObject.x = fromX;
    const firstY = objectRelations[0].to.y;
    const lastY = objectRelations[length - 1].to.y;

    fromObject.y = parseInt((firstY + lastY) / 2);
  });
}
