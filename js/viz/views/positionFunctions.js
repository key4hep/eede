import { setViewportPosition, getContainerSize } from "../draw/app.js";

export const positionTopLeft = () => {
  setViewportPosition(0, 0);
};

export const positionTopCenter = () => {
  const { width } = getContainerSize();
  setViewportPosition(width / 2, 500);
};
