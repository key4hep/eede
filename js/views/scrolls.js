import { canvas } from "../main.js";

export function scrollTopCenter() {
  return { x: (canvas.width - window.innerWidth) / 2, y: 0 };
}

export function scrollTopLeft() {
  return { x: 0, y: 0 };
}
