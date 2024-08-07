const store = {};

export async function textToSVG(id, text, maxWidth) {
  if (store[id]) {
    return store[id];
  }

  const mathjaxContainer = await MathJax.tex2svgPromise(`${text}`, {});
  const svg = mathjaxContainer.firstElementChild;

  const width = parseFloat(svg.getAttribute("width").replace("ex", ""));
  const height = parseFloat(svg.getAttribute("height").replace("ex", ""));

  const ratio = width / height;

  const finalWidth = maxWidth;
  const finalHeight = parseInt(finalWidth / ratio);

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
