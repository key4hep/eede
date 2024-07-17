export function generateMathJaxSvg(text) {
  return MathJax.tex2svg(text).firstElementChild;
}
