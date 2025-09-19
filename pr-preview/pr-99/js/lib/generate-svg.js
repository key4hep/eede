const store = {};

export async function textToSVG(id, text, maxWidth, maxHeight) {
  if (store[id]) {
    return store[id];
  }

  const mathjaxContainer = await MathJax.tex2svgPromise(`${text}`, {});
  const svg = mathjaxContainer.firstElementChild;

  const width = parseFloat(svg.getAttribute("width").replace("ex", ""));
  const height = parseFloat(svg.getAttribute("height").replace("ex", ""));

  const imageRatio = width / height;

  let finalHeight = maxHeight;
  let finalWidth = parseInt(finalHeight * imageRatio);

  if (finalWidth > maxWidth) {
    finalWidth = maxWidth;
    finalHeight = parseInt(finalWidth / imageRatio);
  }

  svg.setAttribute("width", `${finalWidth}px`);
  svg.setAttribute("height", `${finalHeight}px`);

  const src =
    "data:image/svg+xml;base64," +
    btoa(
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
        svg.outerHTML
    );

  store[id] = src;
  return src;
}
