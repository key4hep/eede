export function listView(collection) {
  const width = window.innerWidth;

  const gap = 1;
  const objWidth = collection[0].width;
  const objHorizontalGap = gap * objWidth;
  const objHeight = collection[0].height;
  const objVerticalGap = gap * objHeight;

  const cols = Math.ceil(width / (objWidth + objHorizontalGap));
  const rows = Math.ceil(collection.length / cols);

  const height = rows * (objHeight + objVerticalGap / 2) + objVerticalGap / 2;
  const finalHeight = height > window.innerHeight ? height : window.innerHeight;

  for (let i = 0; i < collection.length; i++) {
    const x = (i % cols) * objWidth + (((i % cols) + 1) * objHorizontalGap) / 2;
    const y =
      Math.floor(i / cols) * objHeight +
      ((Math.floor(i / cols) + 1) * objVerticalGap) / 2;

    collection[i].x = x;
    collection[i].y = y;
  }

  return [width, finalHeight];
}
