import { Application, Container, Culler } from "../pixi.min.mjs";
import { dragEnd } from "./drag.js";
import { addScroll } from "./scroll.js";
import { getPixiState } from "../globals.js";

const pixi = getPixiState();

const createApp = async () => {
  const app = new Application();
  await app.init({
    background: "#ffffff",
    antialias: true,
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

export const createContainer = (app, objects) => {
  const container = new Container();
  pixi.container = container;

  const culler = new Culler();
  culler.cull(container, {
    x: 0,
    y: 0,
    width: app.renderer.width,
    height: app.renderer.height,
  });

  app.stage.addChild(container);
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerup", dragEnd);
  app.stage.on("pointerupoutside", dragEnd);
  addScroll(app, objects);
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
