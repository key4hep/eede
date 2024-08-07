import { Graphics } from "../pixi.min.mjs";
import { getApp, getContainerSize, getContainer } from "./app.js";
import { setRenderable } from "./renderable.js";

const SPEED = 0.5;

export const scrollBars = {
  horizontalThumb: null,
  verticalThumb: null,
};

export const scrollTopLeft = () => {
  const x = 0;
  const y = 0;

  return { x, y };
};

export const scrollTopCenter = () => {
  const app = getApp();
  const { width } = getContainerSize();

  const screenWidth = app.renderer.width;
  const containerWidth = width;

  const x = (screenWidth - containerWidth) / 2;
  const y = 0;

  return { x, y };
};

export const setScroll = (x, y) => {
  const container = getContainer();
  container.position.set(x, y);
};

const addScrollBars = (app, container) => {
  const scrollBarColor = "#e1e1e1";
  const renderer = app.renderer;
  const rendererWidth = renderer.width;
  const rendererHeight = renderer.height;

  const horizontalScrollBarHeight = 7;
  const horizontalScrollBarX = 0;
  const horizontalScrollBarY = rendererHeight - horizontalScrollBarHeight;
  const horizontalScrollBar = new Graphics();
  horizontalScrollBar.rect(
    horizontalScrollBarX,
    horizontalScrollBarY,
    rendererWidth,
    horizontalScrollBarHeight
  );
  horizontalScrollBar.fill(scrollBarColor);
  horizontalScrollBar.zIndex = 4;

  const verticalScrollBarWidth = 7;
  const verticalScrollBarX = rendererWidth - verticalScrollBarWidth;
  const verticalScrollBarY = 0;
  const verticalScrollBar = new Graphics();
  verticalScrollBar.rect(
    verticalScrollBarX,
    verticalScrollBarY,
    verticalScrollBarWidth,
    rendererHeight
  );
  verticalScrollBar.fill(scrollBarColor);
  verticalScrollBar.zIndex = 4;

  app.stage.addChild(horizontalScrollBar);
  app.stage.addChild(verticalScrollBar);

  const thumbColor = "#afafaf";

  const { width: containerWidth, height: containerHeight } = getContainerSize();
  const horizontalThumbWidth = (rendererWidth / containerWidth) * rendererWidth;
  const verticalThumbHeight =
    (rendererHeight / containerHeight) * rendererHeight;

  const containerX = container.x;
  const containerY = container.y;

  const horizontalThumbX =
    (Math.abs(containerX) / containerWidth) * rendererWidth;
  const verticalThumbY =
    (Math.abs(containerY) / containerHeight) * rendererHeight;

  const horizontalThumb = new Graphics();
  horizontalThumb.roundRect(
    0,
    0,
    horizontalThumbWidth,
    horizontalScrollBarHeight,
    5
  );
  horizontalThumb.fill(thumbColor);
  horizontalThumb.zIndex = 5;
  horizontalThumb.position.set(horizontalThumbX, horizontalScrollBarY);
  horizontalScrollBar.addChild(horizontalThumb);

  const verticalThumb = new Graphics();
  verticalThumb.roundRect(0, 0, verticalScrollBarWidth, verticalThumbHeight, 5);
  verticalThumb.fill(thumbColor);
  verticalThumb.zIndex = 5;
  verticalThumb.position.set(verticalScrollBarX, verticalThumbY);
  verticalScrollBar.addChild(verticalThumb);

  scrollBars.horizontalThumb = horizontalThumb;
  scrollBars.verticalThumb = verticalThumb;

  setScrollBarsPosition();
};

export const setScrollBarsPosition = () => {
  const app = getApp();
  const renderer = app.renderer;
  const rendererWidth = renderer.width;
  const rendererHeight = renderer.height;

  const container = getContainer();
  const { width: containerWidth, height: containerHeight } = getContainerSize();

  const containerX = container.x;
  const containerY = container.y;

  const horizontalThumbX =
    (Math.abs(containerX) / containerWidth) * rendererWidth;
  const verticalThumbY =
    (Math.abs(containerY) / containerHeight) * rendererHeight;

  scrollBars.horizontalThumb.position.set(
    horizontalThumbX,
    scrollBars.horizontalThumb.y
  );
  scrollBars.verticalThumb.position.set(
    scrollBars.verticalThumb.x,
    verticalThumbY
  );
};

export const addScroll = (app, objects) => {
  const container = getContainer();
  const renderer = app.renderer;

  container.x = 0;
  container.y = 0;

  const screenWidth = renderer.width;
  const screenHeight = renderer.height;

  addScrollBars(app, container);

  app.canvas.addEventListener("wheel", (e) => {
    if (e.shiftKey) {
      const deltaX = parseInt(e.deltaY * SPEED);
      const newXPosition = container.x - deltaX;
      const isXInBounds =
        newXPosition < 0 &&
        newXPosition > screenWidth - getContainerSize().width;
      if (isXInBounds) {
        container.x = newXPosition;
        scrollBars.horizontalThumb.x =
          (Math.abs(container.x) / getContainerSize().width) * screenWidth;
      }
    } else {
      const deltaX = parseInt(e.deltaX * SPEED);
      const deltaY = parseInt(e.deltaY * SPEED);
      const newXPosition = container.x - deltaX;
      const newYPosition = container.y - deltaY;

      const isXInBounds =
        newXPosition < 0 &&
        newXPosition > screenWidth - getContainerSize().width;
      const isYInBounds =
        newYPosition < 0 &&
        newYPosition > screenHeight - getContainerSize().height;

      if (isXInBounds) {
        container.x = newXPosition;
        scrollBars.horizontalThumb.x =
          (Math.abs(container.x) / getContainerSize().width) * screenWidth;
      }

      if (isYInBounds) {
        container.y = newYPosition;
        scrollBars.verticalThumb.y =
          (Math.abs(container.y) / getContainerSize().height) * screenHeight;
      }
    }
    setRenderable(objects);
  });
};
