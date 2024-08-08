import { Graphics } from "../pixi.min.mjs";
import { getApp, getContainerSize, getContainer } from "./app.js";
import { setRenderable } from "./renderable.js";

const SPEED = 0.5;

const scrollBars = {
  horizontalThumb: null,
  prevHorizontalX: NaN,
  verticalThumb: null,
  prevVerticalY: NaN,
  currentFunction: null,
  objects: null,
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

function startDragHorizontalThumb(event) {
  const app = getApp();

  scrollBars.prevHorizontalX =
    event.data.global.x - scrollBars.horizontalThumb.width / 2;

  app.stage.on("pointermove", moveHorizontalThumb);
}

function moveHorizontalThumb(event) {
  const horizontalScrollBar = scrollBars.horizontalThumb;
  const app = getApp();
  const container = getContainer();

  const { width: containerWidth } = getContainerSize();
  const renderer = app.renderer;
  const rendererWidth = renderer.width;

  const x = event.data.global.x - scrollBars.horizontalThumb.width / 2;
  const deltaX = (x - scrollBars.prevHorizontalX) * 0.25;
  const newThumbX = horizontalScrollBar.x + deltaX;

  if (newThumbX > 0 && newThumbX < rendererWidth - horizontalScrollBar.width) {
    horizontalScrollBar.position.set(newThumbX, horizontalScrollBar.y);
    const newContainerX =
      (horizontalScrollBar.x / rendererWidth) * containerWidth;
    container.x = -newContainerX;
    scrollBars.prevHorizontalX = newThumbX;
  }

  const { objects } = scrollBars;
  setRenderable(objects);
}

function stopHorizontalThumbDrag() {
  const app = getApp();
  app.stage.off("pointermove", moveHorizontalThumb);
}

function startDragVerticalThumb(event) {
  const app = getApp();

  scrollBars.prevVerticalY =
    event.data.global.y - scrollBars.verticalThumb.height / 2;

  app.stage.on("pointermove", moveVerticalThumb);
}

function moveVerticalThumb(event) {
  const verticalScrollBar = scrollBars.verticalThumb;
  const app = getApp();
  const container = getContainer();

  const { height: containerHeight } = getContainerSize();
  const renderer = app.renderer;
  const rendererHeight = renderer.height;

  const y = event.data.global.y - scrollBars.verticalThumb.height / 2;
  const deltaY = (y - scrollBars.prevVerticalY) * 0.25;
  const newThumbY = verticalScrollBar.y + deltaY;

  if (newThumbY > 0 && newThumbY < rendererHeight - verticalScrollBar.height) {
    verticalScrollBar.position.set(verticalScrollBar.x, newThumbY);
    const newContainerY =
      (verticalScrollBar.y / rendererHeight) * containerHeight;
    container.y = -newContainerY;
    scrollBars.prevVerticalY = newThumbY;
  }

  const { objects } = scrollBars;
  setRenderable(objects);
}

function stopVerticalThumbDrag() {
  const app = getApp();
  app.stage.off("pointermove", moveVerticalThumb);
}

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

  horizontalThumb.cursor = "pointer";
  horizontalThumb.eventMode = "static";
  horizontalThumb.interactiveChildren = false;

  horizontalThumb.on("pointerdown", startDragHorizontalThumb);

  verticalThumb.cursor = "pointer";
  verticalThumb.eventMode = "static";
  verticalThumb.interactiveChildren = false;

  verticalThumb.on("pointerdown", startDragVerticalThumb);

  setScrollBarsPosition();

  return [horizontalScrollBar, verticalScrollBar];
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
  scrollBars.prevHorizontalX = horizontalThumbX;
  scrollBars.prevVerticalY = verticalThumbY;
};

export const addScroll = (app, objects) => {
  const container = getContainer();
  const renderer = app.renderer;

  container.x = 0;
  container.y = 0;

  const screenWidth = renderer.width;
  const screenHeight = renderer.height;

  scrollBars.objects = objects;

  let [horizontalScrollBar, verticalScrollBar] = addScrollBars(app, container);
  window.addEventListener("resize", () => {
    setTimeout(() => {
      app.stage.removeChild(horizontalScrollBar);
      app.stage.removeChild(verticalScrollBar);

      [horizontalScrollBar, verticalScrollBar] = addScrollBars(app, container);
    });
  });

  app.stage.on("pointerup", stopHorizontalThumbDrag);
  app.stage.on("pointerupoutside", stopHorizontalThumbDrag);
  app.stage.on("pointerup", stopVerticalThumbDrag);
  app.stage.on("pointerupoutside", stopVerticalThumbDrag);

  app.canvas.addEventListener("wheel", (e) => {
    if (e.shiftKey) {
      const deltaX = parseInt(e.deltaY * SPEED);
      const newXPosition = container.x - deltaX;
      const isXInBounds =
        newXPosition < 0 &&
        newXPosition > screenWidth - getContainerSize().width;
      if (isXInBounds) {
        container.x = newXPosition;
        const newHorizontalThumbX =
          (Math.abs(container.x) / getContainerSize().width) * screenWidth;
        scrollBars.horizontalThumb.x = newHorizontalThumbX;
        scrollBars.prevHorizontalX = newHorizontalThumbX;
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
        const newHorizontalThumbX =
          (Math.abs(container.x) / getContainerSize().width) * screenWidth;
        scrollBars.horizontalThumb.x = newHorizontalThumbX;
        scrollBars.prevHorizontalX = newHorizontalThumbX;
      }

      if (isYInBounds) {
        container.y = newYPosition;
        const newVerticalThumbY =
          (Math.abs(container.y) / getContainerSize().height) * screenHeight;
        scrollBars.verticalThumb.y = newVerticalThumbY;
        scrollBars.prevVerticalY = newVerticalThumbY;
      }
    }
    setRenderable(objects);
  });
};
