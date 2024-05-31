export function drawAll(ctx, parentLinks, childrenLinks, infoBoxes) {
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
