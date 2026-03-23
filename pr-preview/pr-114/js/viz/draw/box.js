import { Graphics, Assets, Sprite, Cache } from "pixi.js";
import {
  getApp,
  getContainer,
  getTextureCache,
} from "../../state/pixi-state.js";

export { addTitleToBox, addLinesToBox } from "./font.js";

export function addBox(box) {
  const container = getContainer();
  container.addChild(box);
}

export function buildBox(object) {
  const boxes = getTextureCache();
  const key = `${object.width}-${object.height}-${object.color}-${object.lineColor}-${object.radius}`;

  if (boxes[key] === undefined) {
    const box = new Graphics();
    const app = getApp();

    box.roundRect(0, 0, object.width, object.height, object.radius);
    box.fill(object.color);
    box.stroke({ width: object.lineWidth, color: object.lineColor });
    boxes[key] = app.renderer.generateTexture(box);
  }

  return new Sprite(boxes[key]);
}

export function redrawBox(object, color, lineColor) {
  const boxes = getTextureCache();
  const key = `${object.width}-${object.height}-${color}-${lineColor}-${object.radius}`;

  if (boxes[key] === undefined) {
    const box = new Graphics();
    const app = getApp();

    box.roundRect(0, 0, object.width, object.height, object.radius);
    box.fill(color);
    box.stroke({ width: object.lineWidth, color: lineColor });
    boxes[key] = app.renderer.generateTexture(box);
  }

  object.renderedBox.texture = boxes[key];
}

export async function svgElementToPixiSprite(id, src) {
  if (!Cache.has(id)) {
    const texture = await Assets.load(src);
    Cache.set(id, texture);
  }
  const texture = Cache.get(id);
  const sprite = Sprite.from(texture);

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
