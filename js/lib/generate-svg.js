export async function textToSVG(text) {
  const mathjaxContainer = await MathJax.tex2svgPromise(text);
  const svg = mathjaxContainer.firstElementChild;

  svg.setAttribute("width", "50px");
  svg.setAttribute("height", "50px");

  const src =
    "data:image/svg+xml;base64," +
    btoa(
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
        svg.outerHTML
    );

  return src;
}
