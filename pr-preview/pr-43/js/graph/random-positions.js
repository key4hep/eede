import { canvas } from "../main.js";

const boxWidth = 120;
const boxHeight = 240;

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateRandomPositions(nodes) {
  const width = canvas.width;
  const height = canvas.height;

  for (const node of nodes) {
    if (isNaN(node.x) && isNaN(node.y)) {
      node.x = randomNumber(0, width - boxWidth);
      node.y = randomNumber(0, height - boxHeight);
    }
  }
}
