import { HTMLText, TextStyle } from "pixi.js";
import { color, size } from "./constants.js";

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

export function addTitleToBox(title, box) {
  const boxTitle = createText(title, {
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: size.textXl,
    fill: color.neutral950,
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
    fontWeight: "normal",
    fontSize: size.textBase,
    fill: color.neutral950,
    wrap: true,
    maxWidth: box.width - 2 * MARGIN,
    lineHeight: size.textLg,
  });
  box.addChild(text);
  text.position.set(MARGIN, y);
  return text.position.y + text.height;
}
