import { canvas, ctx } from "./main.js";
import { drawAll, drawVisible } from "./draw.js";

const mouseDown = function (
  event,
  currentParticles,
  visibleParticles,
  dragTools
) {
  event.preventDefault();
  const boundigClientRect = canvas.getBoundingClientRect();
  const mouseX = parseInt(event.clientX - boundigClientRect.x);
  const mouseY = parseInt(event.clientY - boundigClientRect.y);

  dragTools.prevMouseX = mouseX;
  dragTools.prevMouseY = mouseY;

  const infoBoxes = currentParticles.infoBoxes;
  const visibleBoxes = visibleParticles.infoBoxes;
  for (let i = visibleBoxes.length - 1; i >= 0; i--) {
    if (infoBoxes[visibleBoxes[i]].isHere(mouseX, mouseY)) {
      dragTools.draggedInfoBox = visibleBoxes[i];
      dragTools.isDragging = true;
      return;
    }
  }
};

const mouseUp = function (event, particlesHandler, dragTools) {
  if (!dragTools.isDragging) {
    return;
  }

  event.preventDefault();
  dragTools.isDragging = false;

  // console.time("drawAll");
  drawAll(ctx, particlesHandler);
  // console.timeEnd("drawAll");
};

const mouseOut = function (event, dragTools) {
  if (!dragTools.isDragging) {
    return;
  }

  event.preventDefault();
  dragTools.isDragging = false;
};

const mouseMove = function (
  event,
  currentParticles,
  visibleParticles,
  dragTools
) {
  if (!dragTools.isDragging) {
    return;
  }
  event.preventDefault();

  const boundigClientRect = canvas.getBoundingClientRect();
  const mouseX = parseInt(event.clientX - boundigClientRect.x);
  const mouseY = parseInt(event.clientY - boundigClientRect.y);

  const dx = mouseX - dragTools.prevMouseX;
  const dy = mouseY - dragTools.prevMouseY;

  const infoBox = currentParticles.infoBoxes[dragTools.draggedInfoBox];
  infoBox.x += dx;
  infoBox.y += dy;

  // console.time("drawVisible");
  drawVisible(currentParticles, visibleParticles);
  // console.timeEnd("drawVisible");

  dragTools.prevMouseX = mouseX;
  dragTools.prevMouseY = mouseY;
};

const getVisible = function (currentParticles, visibleParticles) {
  const boundigClientRect = canvas.getBoundingClientRect();

  const { infoBoxes, parentLinks, childrenLinks } = currentParticles;

  const visibleBoxes = [];
  const visibleParentLinks = [];
  const visibleChildrenLinks = [];

  for (const box of infoBoxes) {
    if (box === null) continue;
    if (
      box.isVisible(
        0 - boundigClientRect.x,
        0 - boundigClientRect.y,
        window.innerWidth,
        window.innerHeight
      )
    ) {
      visibleBoxes.push(box.id);
    }
  }

  for (const link of parentLinks) {
    if (
      link.isVisible(
        0 - boundigClientRect.x,
        0 - boundigClientRect.y,
        window.innerWidth,
        window.innerHeight,
        infoBoxes
      )
    ) {
      visibleParentLinks.push(link.id);
    }
  }

  for (const link of childrenLinks) {
    if (
      link.isVisible(
        0 - boundigClientRect.x,
        0 - boundigClientRect.y,
        window.innerWidth,
        window.innerHeight,
        infoBoxes
      )
    ) {
      visibleChildrenLinks.push(link.id);
    }
  }

  /*
  console.log("Visible boxes: ", visibleBoxes);
  console.log("Visible parentLinks: ", visibleParentLinks);
  console.log("Visible childrenLinks: ", visibleChildrenLinks);
  */

  visibleParticles.infoBoxes = visibleBoxes;
  visibleParticles.parentLinks = visibleParentLinks;
  visibleParticles.childrenLinks = visibleChildrenLinks;
};

const onScroll = function (currentParticles, visibleParticles) {
  getVisible(currentParticles, visibleParticles);
};

export { mouseDown, mouseUp, mouseOut, mouseMove, getVisible, onScroll };
