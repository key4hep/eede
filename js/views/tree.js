import { canvas } from "../main.js";

// All particles that are related to itself have an one to many relation
export function buildTree(collection, relationOfReference) {
  const nodes = new Set();
  const children = new Set();

  for (const object of collection) {
    const objects = object.oneToManyRelations[relationOfReference].map(
      (link) => link.to
    );
    nodes.add(`${object.index}-${object.collectionId}`);
    for (const childObject of objects) {
      children.add(`${childObject.index}-${childObject.collectionId}`);
    }
  }

  const rootNodesIds = nodes.difference(children);
  const rootNodes = [];

  collection.forEach((object) => {
    if (rootNodesIds.has(`${object.index}-${object.collectionId}`)) {
      rootNodes.push(object);
    }
  });

  rootNodes.forEach((rootNode) => {
    const stack = [[rootNode, 0]];

    while (stack.length > 0) {
      const [node, row] = stack.pop();
      const id = `${node.index}-${node.collectionId}`;
      if (nodes.has(id)) {
        nodes.delete(id);
        node.row = row;

        const childObjectLinks = node.oneToManyRelations[relationOfReference];

        childObjectLinks.forEach((link) => {
          stack.push([link.to, row + 1]);
        });
      }
    }
  });

  const horizontalGap = collection[0].width * 0.4;
  const verticalGap = collection[0].height * 0.3;
  const boxWidth = collection[0].width;
  const boxHeight = collection[0].height;

  const matrix = [];

  collection.forEach((object) => {
    const row = object.row;
    if (matrix[row] === undefined) {
      matrix[row] = [];
    }
    matrix[row].push(object);
  });

  matrix.forEach((row, i) => {
    row.forEach((object, j) => {
      object.x = j * horizontalGap + j * boxWidth + horizontalGap;
      object.y = i * verticalGap + i * boxHeight + verticalGap;
    });
  });

  const totalWidth =
    boxWidth * matrix[0].length + horizontalGap * (matrix[0].length + 1);

  canvas.width =
    totalWidth > window.innerWidth ? totalWidth : window.innerWidth;

  const totalHeight =
    boxHeight * (matrix.length + 1) + verticalGap * (matrix.length + 2);

  canvas.height =
    totalHeight > window.innerHeight ? totalHeight : window.innerHeight;
}
