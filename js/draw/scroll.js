import { getContainer, getApp } from "./app.js";

export const scrollTopLeft = () => {
  const container = getContainer();
  const x = 0;
  const y = 0;

  container.x = x;
  container.y = y;

  return { x, y };
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
