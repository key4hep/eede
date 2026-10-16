// List 1:1 association in a vertical list
export function positionAssociation(viewObjects, associationName) {
  const associations = viewObjects.associations[associationName];

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
  const totalHeight =
    associations.length * (height + verticalGap) + verticalGap;
  const space = height + verticalGap;
  let accHeight = 0;

  associations.forEach((association) => {
    association.from.x = width / 2 - fromWidth - fromHorizontalGap;
    association.to.x = width / 2 + toHorizontalGap;
    association.from.y = accHeight + space / 2 - fromHeight / 2;
    association.to.y = accHeight + space / 2 - toHeight / 2;

    accHeight += height + verticalGap;
  });

  return [width, totalHeight];
}
