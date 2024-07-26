import {
  Graphics,
  Assets,
  Sprite,
  Text,
  TextStyle,
  Cache,
} from "../pixi.min.mjs";
import { getApp, getContainer } from "./app.js";

const MARGIN = 20;
const PADDING = 5;

function createText(text, { fontFamily, fontSize, fontWeight, align, fill }) {
  return new Text({
    text,
    style: new TextStyle({
      fontFamily,
      fontSize,
      fontWeight,
      align,
      fill,
    }),
    resolution: 2,
  });
}

function createObjectModal(lines) {
  const text = createText(lines.join("\n"), {
    fontFamily: "sans-serif",
    fontSize: 14,
    fontWeight: "normal",
    align: "center",
    fill: "black",
  });

  const width = text.width + PADDING;
  const height = text.height + 2 * MARGIN;

  const box = new Graphics();
  box.roundRect(0, 0, width + PADDING, height + PADDING, 5);
  box.fill("#f1f1f1");
  box.stroke({ width: 1, color: "#000000" });
  box.addChild(text);
  box.zIndex = 2;
  text.position.set((box.width - text.width) / 2, MARGIN);

  return box;
}

function renderObjectModal(objectModal, x, y) {
  const container = getContainer();
  objectModal.position.set(x, y);
  container.addChild(objectModal);
}

function removeObjectModal(objectModal) {
  const container = getContainer();
  if (objectModal !== null) {
    container.removeChild(objectModal);
  }
}

export function addBox(box) {
  const container = getContainer();
  container.addChild(box);
}

const boxes = {};

export function buildBox(object) {
  const key = `${object.width}-${object.height}-${object.color}-${object.radius}`;

  if (boxes[key] === undefined) {
    const box = new Graphics();
    box.roundRect(0, 0, object.width, object.height, object.radius);
    box.fill(object.color);
    box.stroke({ width: 2, color: "#000000" });
    const app = getApp();
    const texture = app.renderer.generateTexture(box);
    boxes[key] = texture;
  }

  const box = new Sprite(boxes[key]);
  return box;
}

export function addHoverModal(box, lines) {
  let objectModal = null;

  box.on("pointerover", () => {
    objectModal = createObjectModal(lines, box.width);
    const objectModalWidth = parseInt(objectModal.width);
    const boxWidth = parseInt(box.width);
    const x = parseInt(box.position.x);
    const xPosition = (boxWidth - objectModalWidth) / 2 + x;
    const y = box.position.y;

    const timeout = setTimeout(() => {
      renderObjectModal(objectModal, xPosition, y);
    }, 500);

    const clean = () => {
      clearTimeout(timeout);
      removeObjectModal(objectModal);
      objectModal = null;
    };

    box.on("pointerdown", clean);
    box.on("pointerout", clean);
  });
}

export function addTitleToBox(title, box) {
  const boxTitle = createText(title, {
    fontFamily: "sans-serif",
    fontSize: 20,
    align: "center",
    fill: "black",
    fontWeight: "bold",
  });
  box.addChild(boxTitle);
  boxTitle.position.set((box.width - boxTitle.width) / 2, MARGIN);
  return boxTitle.position.y + boxTitle.height + 12;
}

export function addLinesToBox(lines, box, y) {
  const text = createText(lines.join("\n"), {
    fontFamily: "sans-serif",
    fontSize: 16,
    fontWeight: "normal",
    align: "center",
    fill: "black",
    width: box.width,
  });
  box.addChild(text);
  text.position.set((box.width - text.width) / 2, y);
  return text.position.y + text.height;
}

export async function svgElementToPixiSprite(id, src, size) {
  let asset;

  if (!Cache.has(id)) {
    Cache.set(id, await Assets.load(src));
  }

  asset = Cache.get(id);
  const sprite = Sprite.from(asset);
  sprite.width = size;
  sprite.height = size;
  return sprite;
}

export function addImageToBox(sprite, box, y) {
  box.addChild(sprite);
  sprite.position.set((box.width - sprite.width) / 2, y);
  return sprite.position.y + sprite.height;
}

export function removeImageFromBox(sprite, box) {
  box.removeChild(sprite);
}
