import { canvas, ctx } from "./main.js";

export function drawAll(ctx, loadedObjects) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const elements of Object.values(loadedObjects)) {
    const { collection, oneToMany, oneToOne } = elements;

    for (const links of Object.values(oneToMany)) {
      for (const link of links) link.draw(ctx);
    }

    for (const link of Object.values(oneToOne)) link.draw(ctx);

    for (const object of collection) object.draw(ctx);
  }
}

export function drawVisible(currentParticles, visibleParticles) {
  const {
    infoBoxes: visibleBoxes,
    parentLinks: visibleParentLinks,
    childrenLinks: visibleChildrenLinks,
  } = visibleParticles;

  const { parentLinks, childrenLinks, infoBoxes } = currentParticles;

  const boundigClientRect = canvas.getBoundingClientRect();
  ctx.clearRect(
    0 - boundigClientRect.x,
    0 - boundigClientRect.y,
    window.innerWidth,
    window.innerHeight
  );
  for (const linkId of visibleParentLinks) {
    if (parentLinks[linkId] !== undefined)
      parentLinks[linkId].draw(ctx, infoBoxes);
  }
  for (const linkId of visibleChildrenLinks) {
    if (childrenLinks[linkId] !== undefined)
      childrenLinks[linkId].draw(ctx, infoBoxes);
  }
  for (const boxId of visibleBoxes) {
    infoBoxes[boxId].draw(ctx);
  }
}
