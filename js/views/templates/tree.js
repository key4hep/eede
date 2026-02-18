import { listView } from "./list.js";

// All particles that are related to itself have an one to many relation
export function buildTree(collection, relationOfReference) {
  collection.forEach((object) => {
    object.row = null;
  });

  const nodes = new Set();
  const children = new Set();
  const childless = new Set();

  for (const object of collection) {
    const childObjects = object.oneToManyRelations[relationOfReference].map(
      (link) => link.to
    );
    const objectId = `${object.index}-${object.collectionId}`;
    nodes.add(objectId);

    if (childObjects.length === 0) {
      childless.add(objectId);
    }

    for (const childObject of childObjects) {
      children.add(`${childObject.index}-${childObject.collectionId}`);
    }
  }

  const rootNodesIds = nodes.difference(children);
  const childlessRootNodesIds = rootNodesIds.intersection(childless);
  const rootNodesWithChildrenIds = rootNodesIds.difference(
    childlessRootNodesIds
  );
  const rootNodesWithChildren = [];
  const childlessRootNodes = [];

  collection.forEach((object) => {
    const objectId = `${object.index}-${object.collectionId}`;
    if (rootNodesWithChildrenIds.has(objectId)) {
      rootNodesWithChildren.push(object);
    }
    if (childlessRootNodesIds.has(objectId)) {
      childlessRootNodes.push(object);
    }
  });

  const horizontalGap = collection[0].width * 0.4;
  const verticalGap = collection[0].height * 0.3;
  const boxWidth = collection[0].width;
  const boxHeight = collection[0].height;

  const [, listHeight] = listView(childlessRootNodes);

  let cols = (window.innerWidth - horizontalGap) / (boxWidth + horizontalGap);
  const decimal = cols % 1;

  if (decimal >= 0.5) {
    cols = cols + 1;
  }
  cols = Math.floor(cols);

  const rows = Math.ceil(childlessRootNodes.length / cols);
  const startingRow = rows;

  rootNodesWithChildren.forEach((rootNode) => {
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

  const matrix = [];

  collection.forEach((object) => {
    const row = object.row;

    if (row === null) {
      return;
    }

    if (matrix[row] === undefined) {
      matrix[row] = [];
    }
    matrix[row].push(object);
  });

  matrix.forEach((row, i) => {
    row.forEach((object, j) => {
      const row = i + startingRow;
      const col = j;
      object.x = col * horizontalGap + col * boxWidth + horizontalGap;
      object.y = row * verticalGap + row * boxHeight + verticalGap;
    });
  });

  let maxWidth = 0;

  matrix.forEach((row) => {
    const rowLength = row.length;
    if (rowLength > maxWidth) {
      maxWidth = rowLength;
    }
  });

  const totalWidth = boxWidth * maxWidth + horizontalGap * (maxWidth + 1);
  const width = totalWidth > window.innerWidth ? totalWidth : window.innerWidth;

  const totalHeight =
    boxHeight * (matrix.length + 1) + verticalGap * (matrix.length + 2);
  const height =
    totalHeight > window.innerHeight ? totalHeight : window.innerHeight;

  return [width, height + listHeight];
}
