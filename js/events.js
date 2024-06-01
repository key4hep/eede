import { canvas, ctx } from "./main.js";
import { drawAll, drawVisible } from "./draw.js";

const mouseDown = function (
  event,
  particlesHandler,
  visibleParticles,
  dragTools
) {
  event.preventDefault();
  const boundigClientRect = canvas.getBoundingClientRect();
  const mouseX = parseInt(event.clientX - boundigClientRect.x);
  const mouseY = parseInt(event.clientY - boundigClientRect.y);

  dragTools.prevMouseX = mouseX;
  dragTools.prevMouseY = mouseY;

  const visibleBoxes = visibleParticles.infoBoxes;
  const infoBoxes = particlesHandler.infoBoxes;
  for (let i = visibleBoxes.length - 1; i >= 0; i--) {
    if (infoBoxes[visibleBoxes[i]].isHere(mouseX, mouseY)) {
      dragTools.draggedInfoBox = visibleBoxes[i];
      dragTools.isDragging = true;
      return;
    }
  }
};

const mouseUp = function (event, dragTools, particlesHandler) {
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
  particlesHandler,
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

  const infoBox = particlesHandler.infoBoxes[dragTools.draggedInfoBox];
  infoBox.x += dx;
  infoBox.y += dy;

  // console.time("drawVisible");
  drawVisible(visibleParticles, particlesHandler);
  // console.timeEnd("drawVisible");

  dragTools.prevMouseX = mouseX;
  dragTools.prevMouseY = mouseY;
};

const getVisible = function (particlesHandler, visibleParticles) {
  const boundigClientRect = canvas.getBoundingClientRect();

  const { infoBoxes, parentLinks, childrenLinks } = particlesHandler;

  let visibleBoxes = [];
  let visibleParentLinks = [];
  let visibleChildrenLinks = [];

  for (const box of infoBoxes) {
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

  for (const boxId of visibleBoxes) {
    for (const linkId of infoBoxes[boxId].parentLinks) {
      visibleParentLinks.push(linkId);
    }
    for (const parentBoxId of infoBoxes[boxId].parents) {
      for (const linkId of infoBoxes[parentBoxId].childrenLinks) {
        visibleChildrenLinks.push(linkId);
      }
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

  for (const boxId of visibleBoxes) {
    for (const linkId of infoBoxes[boxId].childrenLinks) {
      visibleChildrenLinks.push(linkId);
    }
    for (const childrenBoxId of infoBoxes[boxId].children) {
      for (const linkId of infoBoxes[childrenBoxId].parentLinks) {
        visibleParentLinks.push(linkId);
      }
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

  visibleParentLinks = [...new Set(visibleParentLinks)];
  visibleChildrenLinks = [...new Set(visibleChildrenLinks)];

  /*
  console.log("Visible boxes: ", visibleBoxes);
  console.log("Visible parentLinks: ", visibleParentLinks);
  console.log("Visible childrenLinks: ", visibleChildrenLinks);
  */

  visibleParticles.infoBoxes = visibleBoxes;
  visibleParticles.parentLinks = visibleParentLinks;
  visibleParticles.childrenLinks = visibleChildrenLinks;
};

const onScroll = function (particlesHandler, visibleParticles) {
  getVisible(particlesHandler, visibleParticles);
};

export { mouseDown, mouseUp, mouseOut, mouseMove, getVisible, onScroll };
