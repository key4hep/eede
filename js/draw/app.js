import { Application } from "../pixi.min.mjs";

export const pixi = {};

const createApp = async () => {
  const app = new Application();
  await app.init({
    background: "#ffffff",
    antialias: false,
    useContextAlpha: false,
  });

  document.body.appendChild(app.canvas);
  return app;
};

export const startPixi = async () => {
  pixi.app = await createApp();
};
