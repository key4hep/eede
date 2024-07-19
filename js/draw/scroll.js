import { getContainer, getApp } from "./app.js";

export const scrollTopLeft = () => {
  const container = getContainer();
  container.x = 0;
  container.y = 0;
};

export const scrollTopCenter = () => {
  const container = getContainer();
  const app = getApp();

  const screenWidth = app.renderer.width;
  const containerWidth = container.width;

  const x = (screenWidth - containerWidth) / 2;
  const y = 0;
  container.x = x;
  container.y = y;

  return { x, y };
};
