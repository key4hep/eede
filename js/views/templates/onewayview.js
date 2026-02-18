const topMargin = 50;
const horizontalGapPercentage = 0.5;

export function oneWayView(viewObjects, fromCollectionName, relationName) {
  const relations =
    viewObjects.datatypes[fromCollectionName].oneToOne[relationName];

  const fromCollection = relations.map((relation) => relation.from);
  const toCollection = relations.map((relation) => relation.to);

  if (fromCollection.length === 0 || toCollection.length === 0) {
    return [0, 0];
  }

  const fromWidth = fromCollection[0].width;
  const toWidth = toCollection[0].width;
  const fromHorizontalGap = horizontalGapPercentage * fromWidth;
  const toHorizontalGap = horizontalGapPercentage * toWidth;
  const gap = 2 * (fromWidth + toWidth);
  const totalWidth = gap + fromWidth + toWidth;

  const width = totalWidth > window.innerWidth ? totalWidth : window.innerWidth;

  const fromHeight = fromCollection[0].height;
  const toHeight = toCollection[0].height;

  const height = Math.max(fromHeight, toHeight);
  const verticalGap = 0.3 * height;

  const totalHeight =
    fromCollection.length * (height + verticalGap) + verticalGap;

  let accHeight = 0;

  const fromX = width / 2 - fromWidth - fromHorizontalGap;

  const toX = width / 2 + toHorizontalGap;

  for (let i = 0; i < fromCollection.length; i++) {
    fromCollection[i].x = fromX;
    toCollection[i].x = toX;

    const space = height + verticalGap;
    fromCollection[i].y = topMargin + accHeight + space / 2 - fromHeight / 2;
    toCollection[i].y = topMargin + accHeight + space / 2 - toHeight / 2;
    accHeight += height + verticalGap;
  }

  return [width, totalHeight + topMargin];
}
