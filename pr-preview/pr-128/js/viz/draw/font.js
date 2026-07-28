import { HTMLText, TextStyle } from "pixi.js";
import { objectColor, size } from "../../lib/constants/vizStyles.js";

const PADDING = 12;

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
    resolution: window.devicePixelRatio * 2, // Resolution according to predefined zoom "maxScale: 2"
  });
}

export function addTitleToBox(title, box) {
  const boxTitle = createText(title, {
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: size.textXl,
    fill: objectColor.neutral950,
    wrap: true,
    maxWidth: box.width,
  });
  box.addChild(boxTitle);
  boxTitle.position.set((box.width - boxTitle.width) / 2, PADDING);
  return boxTitle.position.y + boxTitle.height + PADDING;
}

export function addLinesToBox(lines, box, y) {
  const text = createText(lines.join("\n"), {
    fontFamily: "sans-serif",
    fontWeight: "normal",
    fontSize: size.textBase,
    fill: objectColor.neutral950,
    wrap: true,
    maxWidth: box.width - 2 * PADDING,
    lineHeight: size.textLg,
  });
  box.addChild(text);
  text.position.set(PADDING, y);
  return text.position.y + text.height;
}
