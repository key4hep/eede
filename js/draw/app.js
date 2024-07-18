import { Application, Container } from "../pixi.min.mjs";

export const pixi = {
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

const worldSize = 5000;

const addScroll = (app) => {
  let x = 0;
  let y = 0;

  app.canvas.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  const { container } = pixi;

  app.ticker.add(() => {
    const screenWidth = app.renderer.width;
    const screenHeight = app.renderer.height;

    const targetX = (x / screenWidth) * (worldSize - screenWidth);
    const targetY = (y / screenHeight) * (worldSize - screenHeight);

    container.x += (-targetX - container.x) * 0.1;
    container.y += (-targetY - container.y) * 0.1;
  });
};

const createContainer = (app) => {
  const container = new Container({
    isRenderGroup: true,
  });
  pixi.container = container;
  app.stage.addChild(container);
};

export const startPixi = async () => {
  const app = await createApp();
  createContainer(app);
  addScroll(app);
  pixi.app = app;
};
