import { Application, Container, Culler } from "../pixi.min.mjs";
import { addScroll } from "./scroll.js";

const pixi = {
  app: null,
  container: null,
  width: NaN,
  height: NaN,
};

const createApp = async () => {
  const app = new Application();
  await app.init({
    background: "#ffffff",
    antialias: false,
    useContextAlpha: false,
    resizeTo: window,
    preference: "webgpu",
    webgpu: {
      powerPreference: "high-performance",
    },
  });

  document.body.appendChild(app.canvas);
  return app;
};

export const createContainer = (app) => {
  const container = new Container({
    isRenderGroup: true,
  });
  pixi.container = container;

  const culler = new Culler();
  culler.cull(container, {
    x: 0,
    y: 0,
    width: app.renderer.width,
    height: app.renderer.height,
  });

  app.stage.addChild(container);
  addScroll(app);
};

export const saveSize = (width, height) => {
  pixi.width = width;
  pixi.height = height;
};

export const getApp = () => {
  return pixi.app;
};

export const getContainer = () => {
  return pixi.container;
};

export const getContainerSize = () => {
  return { width: pixi.width, height: pixi.height };
};

export const startPixi = async () => {
  const app = await createApp();
  pixi.app = app;
};
