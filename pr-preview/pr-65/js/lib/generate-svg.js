export async function textToSVGElement(text) {
  const element = await MathJax.tex2svgPromise(text);
  return element.firstElementChild;
}
