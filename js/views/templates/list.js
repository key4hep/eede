const horizontalGapPercentage = 0.4;
const verticalGapPercentage = 0.3;

export function listView(collection) {
  const width = window.innerWidth;
  const length = collection.length;

  const objWidth = collection[0].width;
  const objHorizontalGap = parseInt(horizontalGapPercentage * objWidth);
  const objHeight = collection[0].height;
  const objVerticalGap = parseInt(verticalGapPercentage * objHeight);

  let cols = (width - objHorizontalGap) / (objWidth + objHorizontalGap);
  const decimal = cols % 1;

  const minDecimal =
    (objWidth + 0.5 * objHorizontalGap) / (objWidth + objHorizontalGap);

  if (decimal >= minDecimal) {
    cols = cols + 1;
  }
  cols = Math.floor(cols);

  const rows = Math.ceil(length / cols);

  const height = rows * (objHeight + objVerticalGap) + objVerticalGap;
  const finalHeight = height > window.innerHeight ? height : window.innerHeight;

  const allX = [];
  for (let i = 1; i <= cols; i++) {
    allX.push(i * objHorizontalGap + (i - 1) * objWidth);
  }

  const maxLength = rows * cols;
  const halfCols = Math.ceil(cols / 2);

  collection.forEach((object, index) => {
    const numElement = index + 1;

    const objRow = Math.ceil(numElement / cols);
    let objCol;
    const res = numElement % cols;
    if (res === 0) {
      objCol = cols;
    } else {
      objCol = res;
    }

    const rowLength =
      maxLength - numElement >= cols ? cols : length - cols * (rows - 1);
    const halfCol = Math.ceil(rowLength / 2);

    const allXIndex = halfCols - (halfCol - objCol);

    const x = allX[allXIndex - 1];
    const y = objRow * objVerticalGap + (objRow - 1) * objHeight;

    object.x = x;
    object.y = y;
  });

  return [width, finalHeight];
}
