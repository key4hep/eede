import { canvas, ctx } from "./main.js";

export function drawAll(ctx, currentParticles) {
  const { parentLinks, childrenLinks, infoBoxes } = currentParticles;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.time("drawParentLinks");
  for (const link of parentLinks) {
    link.draw(ctx, infoBoxes);
  }
  // console.timeEnd("drawParentLinks");
  // console.time("drawChildrenLinks");
  for (const link of childrenLinks) {
    link.draw(ctx, infoBoxes);
  }
  // console.timeEnd("drawChildrenLinks");
  // console.time("drawBoxes");
  for (const infoBox of infoBoxes) {
    if (infoBox !== null) infoBox.draw(ctx);
  }
  // console.timeEnd("drawBoxes");
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
