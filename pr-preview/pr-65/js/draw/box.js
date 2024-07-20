import { Graphics, Assets, Sprite, Text, TextStyle } from "../pixi.min.mjs";
import { getContainer, getElements } from "./app.js";

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
  const elements = getElements();
  const container = getContainer();
  container.addChild(box);
  elements.push(box);
}

export function buildBox(object) {
  const box = new Graphics();
  box.roundRect(0, 0, object.width, object.height, object.radius);
  box.fill(object.color);
  box.stroke({ width: 2, color: "#000000" });
  return box;
}

export function addHoverModal(box, lines) {
  let objectModal = null;

  box
    .on("pointerover", () => {
      objectModal = createObjectModal(lines, box.width);
      const objectModalWidth = parseInt(objectModal.width);
      const boxWidth = parseInt(box.width);
      const x = parseInt(box.position.x);
      const xPosition = (boxWidth - objectModalWidth) / 2 + x;
      const y = box.position.y;

      renderObjectModal(objectModal, xPosition, y);

      box.on("pointerdown", () => {
        removeObjectModal(objectModal);
      });
    })
    .on("pointerout", () => {
      removeObjectModal(objectModal);
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

export async function svgElementToPixiSprite(src) {
  const asset = await Assets.load(src);
  const sprite = Sprite.from(asset);
  sprite.width = 50;
  sprite.height = 50;
  return sprite;
}

export function addImageToBox(sprite, box, y) {
  box.addChild(sprite);
  sprite.position.set((box.width - sprite.width) / 2, y);
  return sprite.position.y + sprite.height;
}
