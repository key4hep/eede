import { Graphics, BitmapText, Assets } from "../pixi.min.mjs";
import { getContainer, getElements } from "./app.js";

const TOP_MARGIN = 20;

export function addBox(box) {
  const elements = getElements();
  const container = getContainer();
  container.addChild(box);
  elements.push(box);
}

export function buildBox(object) {
  const box = new Graphics();
  box.roundRect(object.x, object.y, object.width, object.height, object.radius);
  box.fill(object.color);
  box.stroke({ width: 2, color: "#000000" });
  return box;
}

export function addTitleToBox(title, box) {
  const boxTitle = new BitmapText({
    text: title,
    style: {
      fontFamiliy: "sans-serif",
      fontSize: 16,
      align: "center",
      fill: "black",
      fontWeight: "bold",
    },
  });
  box.addChild(boxTitle);
  boxTitle.y = box.y + TOP_MARGIN;
  boxTitle.x = box.x + (box.width - boxTitle.width) / 2;
  return boxTitle.y;
}

export function addLinesToBox(lines, box, y) {
  let prevY = y;
  lines.forEach((line) => {
    const boxLine = new BitmapText({
      text: line,
      style: {
        fontFamily: "sans-serif",
        fontSize: 14,
        align: "center",
        fill: "black",
      },
    });
    box.addChild(boxLine);
    boxLine.y = prevY + 10;
    boxLine.x = box.x + (box.width - boxLine.width) / 2;
    prevY = boxLine.y + boxLine.height;
  });

  return prevY;
}

export async function svgElementToPixiSprite(src) {
  const sprite = await Assets.load({
    src,
    data: {
      parseAsGraphicsContext: true,
    },
  });
  const graphics = new Graphics(sprite);
  return graphics;
}

export function addImageToBox(sprite, box, y) {
  box.addChild(sprite);
  sprite.y = y;
  sprite.x = box.x + (box.width - sprite.width) / 2;
  return sprite.y + sprite.height;
}
