const SCALE = 1.25;

export async function textToSVG(text, size) {
  const mathjaxContainer = await MathJax.tex2svgPromise(text);
  const svg = mathjaxContainer.firstElementChild;

  svg.setAttribute("width", `${parseInt(size * SCALE)}px`);
  svg.setAttribute("height", `${parseInt(size * SCALE)}px`);

  const src =
    "data:image/svg+xml;base64," +
    btoa(
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
        svg.outerHTML
    );

  return src;
}
