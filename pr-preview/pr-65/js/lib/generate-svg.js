export async function textToSVG(text) {
  const svg = await MathJax.tex2svg(text).firstElementChild;

  const src =
    "data:image/svg+xml;base64," +
    btoa(
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
        svg.outerHTML
    );

  return src;
}
