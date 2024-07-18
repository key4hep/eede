import { pixi } from "./app.js";

export function resizeWindow(width, height) {
  const { app } = pixi;
  const renderer = app.renderer;
  const view = renderer.view;
  view.resize(width, height, window.devicePixelRatio || 1);
}
