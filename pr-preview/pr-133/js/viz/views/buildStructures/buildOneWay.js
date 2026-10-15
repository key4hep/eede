import { emptyCopyObject } from "../../../lib/utils/copy.js";

export function buildOneWay(
  currentObjects,
  viewObjects,
  relationName,
  fromCollectionName,
  toCollectionName,
) {
  emptyCopyObject(currentObjects, viewObjects);

  const relations =
    currentObjects.datatypes[fromCollectionName].oneToOne[relationName] ?? [];

  const fromCollection = relations.map((relation) => relation.from);

  const added = new Set();
  const toCollection = [];
  relations.forEach((relation) => {
    const to = relation.to;
    const toId = `${to.index}-${to.collectionId}`;

    if (!added.has(toId)) {
      added.add(toId);
      toCollection.push(to);
    }
  });

  viewObjects.datatypes[fromCollectionName].oneToOne[relationName] = relations;
  viewObjects.datatypes[fromCollectionName].collection = fromCollection;
  viewObjects.datatypes[toCollectionName].collection = toCollection;
}
