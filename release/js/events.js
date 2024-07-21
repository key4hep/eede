import { canvas, ctx } from "./main.js";
import { drawAll, drawVisible } from "./draw.js";

const mouseDown = function (event, visibleObjects, dragTools) {
  event.preventDefault();
  const boundigClientRect = canvas.getBoundingClientRect();
  const mouseX = parseInt(event.clientX - boundigClientRect.x);
  const mouseY = parseInt(event.clientY - boundigClientRect.y);

  dragTools.prevMouseX = mouseX;
  dragTools.prevMouseY = mouseY;

  for (const { collection } of Object.values(visibleObjects.datatypes)) {
    for (const object of collection) {
      if (object.isHere(mouseX, mouseY)) {
        dragTools.draggedObject = object;
        dragTools.isDragging = true;
        return;
      }
    }
  }
};

const mouseUp = function (event, currentObjects, dragTools) {
  if (!dragTools.isDragging) {
    return;
  }

  event.preventDefault();
  dragTools.isDragging = false;

  // console.time("drawAll");
  drawAll(currentObjects);
  // console.timeEnd("drawAll");
};

const mouseOut = function (event, dragTools) {
  if (!dragTools.isDragging) {
    return;
  }

  event.preventDefault();
  dragTools.isDragging = false;
};

const mouseMove = function (event, visibleObjects, dragTools) {
  const boundigClientRect = canvas.getBoundingClientRect();
  const mouseX = parseInt(event.clientX - boundigClientRect.x);
  const mouseY = parseInt(event.clientY - boundigClientRect.y);

  const allObjects = Object.values(visibleObjects.datatypes)
    .map((datatype) => datatype.collection)
    .flat();

  let someHovered = false;
  for (const object of allObjects) {
    if (object.isHere(mouseX, mouseY)) {
      if (dragTools.hoveredObject !== object) {
        dragTools.hoveredObject = object;
        drawVisible(visibleObjects);
        object.showObjectTip(ctx);
      }
      someHovered = true;
      document.body.style.cursor = "pointer";
      break;
    }
  }

  if (!someHovered) {
    document.body.style.cursor = "default";
    dragTools.hoveredObject = null;
    drawVisible(visibleObjects);
  }

  if (!dragTools.isDragging) {
    return;
  }

  const dx = mouseX - dragTools.prevMouseX;
  const dy = mouseY - dragTools.prevMouseY;

  const draggedObject = dragTools.draggedObject;
  draggedObject.x += dx;
  draggedObject.y += dy;

  drawVisible(visibleObjects);

  dragTools.prevMouseX = mouseX;
  dragTools.prevMouseY = mouseY;
};

const getVisible = function (loadedObjects, visibleObjects) {
  const boundigClientRect = canvas.getBoundingClientRect();

  visibleObjects.datatypes = {};
  visibleObjects.associations = {};
  for (const [objectType, elements] of Object.entries(
    loadedObjects.datatypes ?? {}
  )) {
    const { collection, oneToMany, oneToOne } = elements;

    visibleObjects.datatypes[objectType] = {
      collection: [],
      oneToMany: {},
      oneToOne: {},
    };

    for (const object of collection) {
      if (
        object.isVisible(
          0 - boundigClientRect.x,
          0 - boundigClientRect.y,
          window.innerWidth,
          window.innerHeight
        )
      ) {
        visibleObjects.datatypes[objectType].collection.push(object);
      }
    }

    for (const [name, links] of Object.entries(oneToMany)) {
      visibleObjects.datatypes[objectType].oneToMany[name] = [];

      for (const link of links) {
        if (
          link.isVisible(
            0 - boundigClientRect.x,
            0 - boundigClientRect.y,
            window.innerWidth,
            window.innerHeight
          )
        ) {
          visibleObjects.datatypes[objectType].oneToMany[name].push(link);
        }
      }
    }

    for (const [name, links] of Object.entries(oneToOne)) {
      visibleObjects.datatypes[objectType].oneToOne[name] = [];

      for (const link of links) {
        if (
          link.isVisible(
            0 - boundigClientRect.x,
            0 - boundigClientRect.y,
            window.innerWidth,
            window.innerHeight
          )
        ) {
          visibleObjects.datatypes[objectType].oneToOne[name].push(link);
        }
      }
    }
  }

  for (const [name, links] of Object.entries(
    loadedObjects.associations ?? {}
  )) {
    visibleObjects.associations[name] = [];

    for (const link of links) {
      if (
        link.isVisible(
          0 - boundigClientRect.x,
          0 - boundigClientRect.y,
          window.innerWidth,
          window.innerHeight
        )
      ) {
        visibleObjects.associations[name].push(link);
      }
    }
  }
};

const onScroll = function (currentObjects, visibleObjects) {
  getVisible(currentObjects, visibleObjects);
};

export { mouseDown, mouseUp, mouseOut, mouseMove, getVisible, onScroll };
