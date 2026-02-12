const minHorizontalGapPercentage = 0.3;
const verticalGapPercentage = 0.3;

const bestHorizontalFit = (windowWidth, objectWidth) => {
  let columns = 1;
  let percentage =
    (windowWidth - columns * objectWidth) / (objectWidth * (1 + columns));
  let prevPercentage = percentage;

  while (percentage >= minHorizontalGapPercentage) {
    prevPercentage = percentage;
    columns += 1;
    percentage =
      (windowWidth - columns * objectWidth) / (objectWidth * (1 + columns));
  }

  return [columns - 1, prevPercentage];
};

export function listView(collection) {
  if (collection.length < 1) {
    return [0, 0];
  }

  const width = window.innerWidth;
  const length = collection.length;

  const objHeight = collection[0].height;
  const objVerticalGap = parseInt(verticalGapPercentage * objHeight);
  const objWidth = collection[0].width;
  const [cols, horizontalGapPercentage] = bestHorizontalFit(width, objWidth);
  const objHorizontalGap = parseInt(horizontalGapPercentage * objWidth);

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
