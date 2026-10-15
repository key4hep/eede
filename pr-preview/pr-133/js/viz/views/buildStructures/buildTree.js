import { emptyCopyObject } from "../../../lib/utils/copy.js";

export function buildTree(
  currentObjects,
  viewObjects,
  collectionName,
  relationsNames,
) {
  emptyCopyObject(currentObjects, viewObjects);
  viewObjects.datatypes[collectionName].collection =
    currentObjects.datatypes[collectionName].collection;

  relationsNames.forEach((relationName) => {
    viewObjects.datatypes[collectionName].oneToMany[relationName] =
      currentObjects.datatypes[collectionName].oneToMany[relationName];
  });
}
