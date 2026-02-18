import { Graphics, Assets, Sprite, HTMLText, TextStyle, Cache } from "pixi.js";
import { getApp, getContainer } from "./app.js";

const MARGIN = 16;
const PADDING = 8;

function createText(
  text,
  {
    fontFamily,
    fontSize,
    fontWeight,
    align,
    fill,
    wrap = false,
    maxWidth,
    lineHeight,
  },
) {
  return new HTMLText({
    text,
    style: new TextStyle({
      fontFamily,
      fontSize,
      fontWeight,
      align,
      fill,
      wordWrap: wrap,
      wordWrapWidth: maxWidth,
      lineHeight,
    }),
  });
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

const particleDetails = document.getElementById("particle-details");
let selectedBox = null;

export function showParticleDetails(box, lines) {
  let changeSelection = false;

  box.on("pointerdown", () => {
    changeSelection = true;
  });

  box.on("pointermove", () => {
    changeSelection = false;
  });

  box.on("pointerup", () => {
    // Do not change selection if particle was dragged
    if (!changeSelection) return;

    if (selectedBox === box) {
      // Undo selection when selected particle is clicked again
      selectedBox.tint = 0xffffff;
      selectedBox = null;
      particleDetails.innerHTML = "";
    } else {
      // Change selection when a different particle is clicked
      if (selectedBox) selectedBox.tint = 0xffffff;

      // Select particle
      box.tint = 0xcfe6ef;
      selectedBox = box;
      particleDetails.innerHTML = lines.join("");
    }
  });
}

export function addTitleToBox(title, box) {
  const boxTitle = createText(title, {
    fontFamily: "sans-serif",
    fontSize: 20,
    fill: "black",
    fontWeight: "bold",
    wrap: true,
    maxWidth: box.width,
  });
  box.addChild(boxTitle);
  boxTitle.position.set((box.width - boxTitle.width) / 2, MARGIN);
  return boxTitle.position.y + boxTitle.height + PADDING;
}

export function addLinesToBox(lines, box, y) {
  const text = createText(lines.join("\n"), {
    fontFamily: "sans-serif",
    fontSize: 16,
    fontWeight: "normal",
    fill: "black",
    wrap: true,
    maxWidth: box.width - 2 * MARGIN,
    lineHeight: 18, // Consistent box height between different browsers
  });
  box.addChild(text);
  text.position.set(MARGIN, y);
  return text.position.y + text.height;
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
