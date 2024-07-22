import { Application, Container, Culler } from "../pixi.min.mjs";

const SPEED = 0.5;
const MARGIN = 0;

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

const addScroll = (app) => {
  const container = getContainer();
  const renderer = app.renderer;

  container.x = 0;
  container.y = 0;

  const screenWidth = renderer.width;
  const screenHeight = renderer.height;

  app.canvas.addEventListener("wheel", (e) => {
    const deltaX = parseInt(e.deltaX * SPEED);
    const deltaY = parseInt(e.deltaY * SPEED);

    const newXPosition = container.x - deltaX;
    const newYPosition = container.y - deltaY;

    const isXInBounds =
      newXPosition < 0 && newXPosition > screenWidth - pixi.width;

    const isYInBounds =
      newYPosition < 0 && newYPosition > screenHeight - pixi.height;

    if (isXInBounds) {
      container.x = newXPosition;
    }
    if (isYInBounds) {
      container.y = newYPosition;
    }
  });
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
  createContainer(app);
  pixi.app = app;
};
