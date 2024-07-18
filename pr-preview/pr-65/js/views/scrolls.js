export function scrollTopCenter() {
  const canvas = document.querySelector("canvas");
  const x = canvas.width / 2;
  return { x, y: 0 };
}

export function scrollTopLeft() {
  return { x: 0, y: 0 };
}
