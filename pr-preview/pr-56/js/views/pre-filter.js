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

  const fromCollection = association.map((association) => association.from);

  const toCollection = association.map((association) => association.to);

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
    currentObjects.datatypes[fromCollectionName].oneToOne[relationName];

  const fromCollection = relations.map((relation) => relation.from);
  const toCollection = relations.map((relation) => relation.to);

  viewObjects.datatypes[fromCollectionName].oneToOne[relationName] = relations;
  viewObjects.datatypes[fromCollectionName].collection = fromCollection;
  viewObjects.datatypes[toCollectionName].collection = toCollection;
}
