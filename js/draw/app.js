import { Application, Container } from "../pixi.min.mjs";

const SPEED = 0.3;
const MARGIN = 100;

const pixi = {
  app: null,
  container: null,
  elements: [],
};

const createApp = async () => {
  const app = new Application();
  await app.init({
    background: "#ffffff",
    antialias: false,
    useContextAlpha: false,
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);
  return app;
};

const addScroll = (app) => {
  const container = pixi.container;
  const renderer = app.renderer;

  container.x = 0;
  container.y = 0;

  const screenWidth = renderer.width;
  const screenHeight = renderer.height;

  app.canvas.addEventListener("wheel", (e) => {
    const deltaX = parseInt(e.deltaX) * SPEED;
    const deltaY = parseInt(e.deltaY) * SPEED;

    const newXPosition = container.x - deltaX;
    const newYPosition = container.y - deltaY;

    const absXPosition = Math.abs(newXPosition);
    const absYPosition = Math.abs(newYPosition);

    const isXInBounds =
      newXPosition < 0 && absXPosition + screenWidth < container.width + MARGIN;
    const isYInBounds =
      newYPosition < 0 &&
      absYPosition + screenHeight < container.height + MARGIN;

    if (isXInBounds) {
      container.x = newXPosition;
    }
    if (isYInBounds) {
      container.y = newYPosition;
    }
  });
};

const createContainer = (app) => {
  const container = new Container({
    isRenderGroup: true,
  });
  pixi.container = container;
  app.stage.addChild(container);
};

export const setContainerSize = (width, height) => {
  const container = getContainer();
  container.width = width;
  container.height = height;
};

export const getApp = () => {
  return pixi.app;
};

export const getContainer = () => {
  return pixi.container;
};

export const getElements = () => {
  return pixi.elements;
};

export const startPixi = async () => {
  const app = await createApp();
  createContainer(app);
  addScroll(app);
  pixi.app = app;
};
