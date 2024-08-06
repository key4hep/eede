import { getApp, getContainerSize, getContainer } from "./app.js";
import { setRenderable } from "./renderable.js";

const SPEED = 0.5;

export const scrollTopLeft = () => {
  const x = 0;
  const y = 0;

  return { x, y };
};

export const scrollTopCenter = () => {
  const app = getApp();
  const { width } = getContainerSize();

  const screenWidth = app.renderer.width;
  const containerWidth = width;

  const x = (screenWidth - containerWidth) / 2;
  const y = 0;

  return { x, y };
};

export const setScroll = (x, y) => {
  const container = getContainer();
  container.position.set(x, y);
};

export const addScroll = (app, objects) => {
  const container = getContainer();
  const renderer = app.renderer;

  container.x = 0;
  container.y = 0;

  const screenWidth = renderer.width;
  const screenHeight = renderer.height;

  app.canvas.addEventListener("wheel", (e) => {
    if (e.shiftKey) {
      const deltaX = parseInt(e.deltaY * SPEED);
      const newXPosition = container.x - deltaX;
      const isXInBounds =
        newXPosition < 0 &&
        newXPosition > screenWidth - getContainerSize().width;
      if (isXInBounds) {
        container.x = newXPosition;
      }
    } else {
      const deltaX = parseInt(e.deltaX * SPEED);
      const deltaY = parseInt(e.deltaY * SPEED);
      const newXPosition = container.x - deltaX;
      const newYPosition = container.y - deltaY;

      const isXInBounds =
        newXPosition < 0 &&
        newXPosition > screenWidth - getContainerSize().width;
      const isYInBounds =
        newYPosition < 0 &&
        newYPosition > screenHeight - getContainerSize().height;

      if (isXInBounds) {
        container.x = newXPosition;
      }

      if (isYInBounds) {
        container.y = newYPosition;
      }
    }
    setRenderable(objects);
  });
};
