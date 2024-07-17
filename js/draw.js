import { canvas, ctx } from "./main.js";
import { updateCanvas } from "./lib/graphic-primitives.js";

function draw(objects) {
  const datatypes = objects.datatypes;
  const associations = objects.associations;

  for (const collection of Object.values(associations)) {
    for (const association of collection) {
      association.draw(ctx);
    }
  }

  for (const elements of Object.values(datatypes)) {
    const { collection, oneToMany, oneToOne } = elements;

    for (const links of Object.values(oneToMany)) {
      for (const link of links) {
        link.draw(ctx);
      }
    }

    for (const links of Object.values(oneToOne)) {
      for (const link of links) {
        link.draw(ctx);
      }
    }

    for (const object of collection) {
      object.draw(ctx);
    }
  }
}

export function drawAll(loadedObjects) {
  emptyCanvas();
  draw(loadedObjects);
}

export function drawVisible(visibleObjects) {
  emptyVisibleCanvas();
  draw(visibleObjects);
}

export function emptyCanvas() {
  updateCanvas(ctx, 0, 0, canvas.width, canvas.height);
}

function emptyVisibleCanvas() {
  const boundigClientRect = canvas.getBoundingClientRect();
  updateCanvas(
    ctx,
    0 - boundigClientRect.x,
    0 - boundigClientRect.y,
    window.innerWidth,
    window.innerHeight
  );
}
