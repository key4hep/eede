import { emptyCopyObject } from "../lib/copy.js";

export function preFilterAssociation(
  currentObjects,
  viewObjects,
  associationName,
  fromCollectionName,
  toCollectionName
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

export function preFilterTree(
  currentObjects,
  viewObjects,
  collectionName,
  relationsNames
) {
  emptyCopyObject(currentObjects, viewObjects);
  viewObjects.datatypes[collectionName].collection =
    currentObjects.datatypes[collectionName].collection;

  relationsNames.forEach((relationName) => {
    viewObjects.datatypes[collectionName].oneToMany[relationName] =
      currentObjects.datatypes[collectionName].oneToMany[relationName];
  });
}

export function preFilterList(currentObjects, viewObjects, collectionName) {
  emptyCopyObject(currentObjects, viewObjects);

  viewObjects.datatypes[collectionName].collection =
    currentObjects.datatypes[collectionName].collection;
}

export function preFilterOneWay(
  currentObjects,
  viewObjects,
  relationName,
  fromCollectionName,
  toCollectionName
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
