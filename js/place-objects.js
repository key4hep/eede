import { fruchtermanReingold } from "./graph/fruchrein.js";

function objectToNode(object) {
  const edges = [];

  const oneToManyRelations = object.oneToManyRelations ?? {};
  const oneToOneRelations = object.oneToOneRelations ?? {};
  const associations = object.associations ?? {};

  for (const link of Object.values(oneToOneRelations)) {
    edges.push(link);
  }

  for (const link of Object.values(associations)) {
    edges.push(link);
  }

  for (const links of Object.values(oneToManyRelations)) {
    for (const link of links) {
      edges.push(link);
    }
  }

  return {
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    edges,
  };
}

export function placeObjects(objects) {
  const nodes = [];
  const edges = [];

  const datatypes = objects.datatypes;
  const associations = objects.associations;

  for (const { collection, oneToOne, oneToMany } of Object.values(datatypes)) {
    for (const object of collection) {
      nodes.push(objectToNode(object));
    }
    for (const links of Object.values(oneToOne)) {
      for (const link of links) {
        edges.push(link);
      }
    }
    for (const links of Object.values(oneToMany)) {
      for (const link of links) {
        edges.push(link);
      }
    }
  }

  for (const collection of Object.values(associations)) {
    for (const association of collection) {
      edges.push(association);
    }
  }

  console.log(nodes, edges);

  fruchtermanReingold(nodes, edges);
}
