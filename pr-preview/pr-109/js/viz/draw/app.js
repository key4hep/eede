import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { dragEnd } from "./drag.js";
import { setRenderable } from "./renderable.js";
import { getPixiState } from "../pixi.js";
import { objectColor } from "../constants/vizStyles.js";

const pixi = getPixiState();

const createApp = async () => {
  const app = new Application();
  await app.init({
    background: objectColor.neutral50,
    antialias: true,
    useContextAlpha: false,
    resizeTo: window,
    resolution: window.devicePixelRatio,
    autoDensity: true,
    preference: "webgpu",
    webgpu: {
      powerPreference: "high-performance",
    },
  });

  document.body.appendChild(app.canvas);
  return app;
};

export const createContainer = (app, objects) => {
  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: pixi.width,
    worldHeight: pixi.height,
    events: app.renderer.events,
  });
  pixi.container = viewport;

  app.stage.addChild(viewport);
  viewport
    .drag({
      pressDrag: false, // disables click to drag
      wheel: false, // prevents the drag method from handling wheel events
    })
    .pinch()
    .clampZoom({ minScale: 0.1, maxScale: 2 });

  viewport.scale.set(1);

  app.canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      if (e.ctrlKey) {
        const newScale = Math.max(
          0.1,
          Math.min(2, viewport.scaled * (1 - e.deltaY * 0.005)),
        );

        viewport.setZoom(newScale, true);
      } else {
        viewport.x -= e.deltaX;
        viewport.y -= e.deltaY;
      }

      setRenderable(objects);
    },
    { passive: false }, // Override default listener behaviour
  );

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerup", dragEnd);
  app.stage.on("pointerupoutside", dragEnd);
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

export const getViewportPosition = () => {
  const center = pixi.container.center;
  return { x: center.x, y: center.y };
};

export const setViewportPosition = (x, y) => {
  pixi.container.moveCenter(x, y);
};

export const getContainerSize = () => {
  return { width: pixi.width, height: pixi.height };
};

export const startPixi = async () => {
  const app = await createApp();
  pixi.app = app;
};
