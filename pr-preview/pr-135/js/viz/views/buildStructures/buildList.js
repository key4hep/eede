import { emptyCopyObject } from "../../../lib/utils/copy.js";

export function buildList(currentObjects, viewObjects, collectionName) {
  emptyCopyObject(currentObjects, viewObjects);

  viewObjects.datatypes[collectionName].collection =
    currentObjects.datatypes[collectionName].collection;
}
