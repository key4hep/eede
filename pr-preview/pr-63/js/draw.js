export function draw(app, objects) {
  const datatypes = objects.datatypes;
  const associations = objects.associations;

  for (const collection of Object.values(associations)) {
    for (const association of collection) {
      association.draw(app);
    }
  }

  for (const elements of Object.values(datatypes)) {
    const { collection, oneToMany, oneToOne } = elements;

    for (const links of Object.values(oneToMany)) {
      for (const link of links) {
        link.draw(app);
      }
    }

    for (const links of Object.values(oneToOne)) {
      for (const link of links) {
        link.draw(app);
      }
    }

    for (const object of collection) {
      object.draw(app);
    }
  }
}

export function drawAll(loadedObjects) {
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
