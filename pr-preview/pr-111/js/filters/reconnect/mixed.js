import { getRelationsFromCollections } from "../../lib/extract-relations.js";

export function reconnectMixedViews(viewCurrentObjects, ids, collections) {
  const idsToRemove = new Set();
  const idsToShow = new Set();

  const relationsToCheck = getRelationsFromCollections(collections);

  for (const { collection, oneToMany, oneToOne } of Object.values(
    viewCurrentObjects.datatypes
  )) {
    {
      for (const object of collection) {
        const { oneToManyRelations, oneToOneRelations } = object;
        object.saveRelations();

        const objectId = `${object.index}-${object.collectionId}`;

        object.oneToManyRelations = {};
        object.oneToOneRelations = {};

        for (const [relationName, relations] of Object.entries(
          oneToManyRelations
        )) {
          if (!relationsToCheck.has(relationName)) {
            continue;
          }

          object.oneToManyRelations[relationName] = [];
          for (const relation of relations) {
            const { to } = relation;
            const toId = `${to.index}-${to.collectionId}`;

            if (ids.has(toId)) {
              oneToMany[relationName].push(relation);
              object.oneToManyRelations[relationName].push(relation);
              idsToShow.add(objectId);
              idsToShow.add(toId);
            } else {
              idsToRemove.add(objectId);
            }
          }
        }

        for (const [relationName, relation] of Object.entries(
          oneToOneRelations
        )) {
          if (!relationsToCheck.has(relationName)) {
            continue;
          }

          const { to } = relation;
          const toId = `${to.index}-${to.collectionId}`;

          if (ids.has(toId)) {
            oneToOne[relationName].push(relation);
            object.oneToOneRelations[relationName] = relation;
            idsToShow.add(objectId);
            idsToShow.add(toId);
          } else {
            idsToRemove.add(objectId);
          }
        }
      }
    }
  }

  for (const [collectionName, { collection }] of Object.entries(
    viewCurrentObjects.datatypes
  )) {
    viewCurrentObjects.datatypes[collectionName].collection = collection.filter(
      (object) => !idsToRemove.has(`${object.index}-${object.collectionId}`)
    );
  }

  for (const [collectionName, { collection }] of Object.entries(
    viewCurrentObjects.datatypes
  )) {
    viewCurrentObjects.datatypes[collectionName].collection = collection.filter(
      (object) => idsToShow.has(`${object.index}-${object.collectionId}`)
    );
  }
}
