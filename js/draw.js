import { canvas, ctx } from "./main.js";

export function drawAll(ctx, particlesHandler) {
  const { parentLinks, childrenLinks, infoBoxes } = particlesHandler;

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

export function drawVisible(visibleParticles, particlesHandler) {
  const {
    infoBoxes: visibleBoxes,
    parentLinks: visibleParentLinks,
    childrenLinks: visibleChildrenLinks,
  } = visibleParticles;

  const { parentLinks, childrenLinks, infoBoxes } = particlesHandler;

  const boundigClientRect = canvas.getBoundingClientRect();
  ctx.clearRect(
    0 - boundigClientRect.x,
    0 - boundigClientRect.y,
    window.innerWidth,
    window.innerHeight
  );
  for (const linkId of visibleParentLinks) {
    parentLinks[linkId].draw(ctx, infoBoxes);
  }
  for (const linkId of visibleChildrenLinks) {
    childrenLinks[linkId].draw(ctx, infoBoxes);
  }
  for (const boxId of visibleBoxes) {
    infoBoxes[boxId].draw(ctx);
  }
}
