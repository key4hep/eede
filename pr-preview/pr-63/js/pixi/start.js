import { Application } from "./pixi.min.mjs";

export async function createPixi(
  width = window.innerWidth,
  height = window.innerHeight
) {
  const app = new Application();
  await app.init({ background: "#ffffff", antialias: false, width, height });
  const canvas = app.canvas;
  canvas.id = "canvas";

  const previousCanvas = document.getElementById("canvas");
  if (previousCanvas) {
    previousCanvas.remove();
  }
  document.body.appendChild(canvas);

  return app;
}
