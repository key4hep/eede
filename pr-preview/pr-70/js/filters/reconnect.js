import { emptyCopyObject } from "../lib/copy.js";

export function reconnect(viewObjects, viewCurrentObjects, criteriaFunctions) {
  emptyCopyObject(viewObjects, viewCurrentObjects);

  const ids = new Set();
  for (const [collection, criteriaFunction] of Object.entries(
    criteriaFunctions
  )) {
    const originalCollection = viewObjects.datatypes[collection].collection;
    const filteredCollection = originalCollection.filter((object) =>
      criteriaFunction(object)
    );
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
      object.saveLinks();
      const { oneToManyRelations, oneToOneRelations } = object;

      for (const relationName in oneToManyRelations) {
        object.oneToManyRelations[relationName] = [];
      }

      for (const relationName in oneToOneRelations) {
        object.oneToOneRelations[relationName] = null;
      }

      for (const [relationName, relations] of Object.entries(
        oneToManyRelations
      )) {
        for (const relation of relations) {
          const toObject = relation.to;
          const toObjectId = `${toObject.index}-${toObject.collectionId}`;

          if (ids.has(toObjectId)) {
            oneToMany[relationName].push(relation);
            object.oneToManyRelations[relationName].push(relation);
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
          oneToOne[relationName].push(relation);
          object.oneToOneRelations[relationName] = relation;
        } else {
        }
      }
    }
  }
}

export function restoreObjectsLinks(viewObjects) {
  for (const { collection } of Object.values(viewObjects.datatypes)) {
    for (const object of collection) {
      object.restoreLinks();
    }
  }
}
