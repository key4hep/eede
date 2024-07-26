// List 1:1 association in a vertical list
export function buildAssociationView(viewObjects, associationName) {
  const associations = viewObjects.associations[associationName];
  const length = associations.length;

  const fromWidth = associations[0].from.width;
  const toWidth = associations[0].to.width;
  const fromHorizontalGap = 0.3 * fromWidth;
  const toHorizontalGap = 0.3 * toWidth;
  const gap = 2 * (fromWidth + toWidth);
  const totalWidth = gap + fromWidth + toWidth;

  const width = totalWidth > window.innerWidth ? totalWidth : window.innerWidth;

  const fromHeight = associations[0].from.height;
  const toHeight = associations[0].to.height;

  const height = Math.max(fromHeight, toHeight);
  const verticalGap = 0.3 * height;

  const totalHeight = length * (height + verticalGap) + verticalGap;

  let accHeight = 0;

  const fromX = width / 2 - fromWidth - fromHorizontalGap;

  const toX = width / 2 + toHorizontalGap;

  associations.forEach((association) => {
    association.from.x = fromX;
    association.to.x = toX;

    const space = height + verticalGap;
    const fromY = accHeight + space / 2 - fromHeight / 2;
    const toY = accHeight + space / 2 - toHeight / 2;
    association.from.y = fromY;
    association.to.y = toY;
    accHeight += height + verticalGap;
  });

  return [width, totalHeight];
}
