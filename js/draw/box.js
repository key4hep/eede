import {
  Graphics,
  BitmapText,
  Assets,
  Sprite,
  Point,
  Text,
  TextStyle,
} from "../pixi.min.mjs";
import { getContainer, getElements } from "./app.js";

const TOP_MARGIN = 20;

function createText(text, { fontFamily, fontSize, align, fill, fontWeight }) {
  return new Text({
    text,
    style: new TextStyle({
      fontFamily: fontFamily,
      fontSize,
      align,
      fill,
      fontWeight,
    }),
    resolution: 2,
  });
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

export function addTitleToBox(title, box) {
  const boxTitle = createText(title, {
    fontFamily: "sans-serif",
    fontSize: 20,
    align: "center",
    fill: "black",
    fontWeight: "bold",
  });
  box.addChild(boxTitle);
  boxTitle.position.set((box.width - boxTitle.width) / 2, TOP_MARGIN);
  return boxTitle.position.y + boxTitle.height + 12;
}

export function addLinesToBox(lines, box, y) {
  let prevY = y;
  lines.forEach((line) => {
    const boxLine = createText(line, {
      fontFamily: "sans-serif",
      fontSize: 16,
      align: "center",
      fill: "black",
      fontWeight: "normal",
    });
    box.addChild(boxLine);
    boxLine.position.set((box.width - boxLine.width) / 2, prevY);
    prevY = boxLine.position.y + boxLine.height;
  });

  return prevY;
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
