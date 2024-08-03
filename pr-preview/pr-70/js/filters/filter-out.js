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

  const collectionsNames = Object.keys(criteriaFunctions);

  for (const collectionName of collectionsNames) {
    const { collection, oneToOne, oneToMany } =
      viewCurrentObjects.datatypes[collectionName];

    for (const object of collection) {
      const { oneToManyRelations, oneToOneRelations } = object;

      for (const [relationName, relations] of Object.entries(
        oneToManyRelations
      )) {
        for (const relation of relations) {
          const toObject = relation.to;
          const toObjectId = `${toObject.index}-${toObject.collectionId}`;

          if (ids.has(toObjectId)) {
          } else {
          }
        }
      }

      for (const [relationName, relation] of Object.entries(
        oneToOneRelations
      )) {
        const toObject = relation.to;
        const toObjectId = `${toObject.index}-${toObject.collectionId}`;

        if (ids.has(toObjectId)) {
        } else {
        }
      }
    }
  }
}
