import { canvas, ctx } from "./main.js";

function draw(objects) {
  for (const elements of Object.values(objects.datatypes ?? {})) {
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

export function drawAll(ctx, loadedObjects) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  draw(loadedObjects);
}

export function drawVisible(visibleObjects) {
  const boundigClientRect = canvas.getBoundingClientRect();
  ctx.clearRect(
    0 - boundigClientRect.x,
    0 - boundigClientRect.y,
    window.innerWidth,
    window.innerHeight
  );

  draw(visibleObjects);
}
