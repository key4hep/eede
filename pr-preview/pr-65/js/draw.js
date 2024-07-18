export function drawAll(loadedObjects) {
  emptyCanvas();
  draw(loadedObjects);
}

export function drawVisible(visibleObjects) {
  emptyVisibleCanvas();
  draw(visibleObjects);
}

export function emptyCanvas() {
  // updateCanvas(null, 0, 0, canvas.width, canvas.height);
}

function emptyVisibleCanvas() {
  // const boundigClientRect = canvas.getBoundingClientRect();
  // updateCanvas(
  //   null,
  //   0 - boundigClientRect.x,
  //   0 - boundigClientRect.y,
  //   window.innerWidth,
  //   window.innerHeight
  // );
}
