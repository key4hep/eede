import { getContainerSize, getContainer } from "./app.js";

export const scrollTopLeft = () => {
  const container = getContainer();
  container.position.set(0, 0);
};

export const scrollTopCenter = () => {
  const container = getContainer();
  const { width } = getContainerSize();

  container.position.set(width / 2, 500);
};
