import { emptyCopyObject } from "../lib/copy.js";

export function filterOut(
  viewObjects,
  viewCurrentObjects,
  criteriaFunctions,
  inverted = false
) {
  emptyCopyObject(viewObjects, viewCurrentObjects);

  const ids = new Set();
  for (const [collection, criteriaFunction] of Object.entries(
    criteriaFunctions
  )) {
    const originalCollection = viewObjects.datatypes[collection].collection;
    let filteredCollection;

    if (inverted) {
      filteredCollection = originalCollection.filter(
        (object) => !criteriaFunction(object)
      );
    } else {
      filteredCollection = originalCollection.filter((object) =>
        criteriaFunction(object)
      );
    }

    filteredCollection.forEach((object) =>
      ids.add(`${object.index}-${object.collectionId}`)
    );
    viewCurrentObjects.datatypes[collection].collection = filteredCollection;
  }

  return ids;
}
