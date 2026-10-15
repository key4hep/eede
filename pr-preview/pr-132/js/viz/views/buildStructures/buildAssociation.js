import { emptyCopyObject } from "../../../lib/utils/copy.js";

export function buildAssociation(
  currentObjects,
  viewObjects,
  associationName,
  fromCollectionName,
  toCollectionName,
) {
  emptyCopyObject(currentObjects, viewObjects);

  const association = currentObjects.associations[associationName];

  if (typeof association === "undefined") {
    return;
  }

  const added = new Set();
  const fromCollection = [];
  const toCollection = [];

  association.forEach((relation) => {
    const from = relation.from;
    const fromId = `${from.index}-${from.collectionId}`;

    if (!added.has(fromId)) {
      added.add(fromId);
      fromCollection.push(from);
    }

    const to = relation.to;
    const toId = `${to.index}-${to.collectionId}`;

    if (!added.has(toId)) {
      added.add(toId);
      toCollection.push(to);
    }
  });

  viewObjects.datatypes[fromCollectionName].collection = fromCollection;
  viewObjects.datatypes[toCollectionName].collection = toCollection;
  viewObjects.associations[associationName] = association;
}
