import { getApp, getContainer } from "./app.js";

export const scrollTopLeft = () => {
  const x = 0;
  const y = 0;

  return { x, y };
};

export const scrollTopCenter = () => {
  const app = getApp();
  const container = getContainer();

  const screenWidth = app.renderer.width;
  const containerWidth = container.width;

  const x = (screenWidth - containerWidth) / 2;
  const y = 0;

  return { x, y };
};
