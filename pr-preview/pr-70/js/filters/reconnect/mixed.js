export function reconnectMixedViews(viewCurrentObjects, ids) {
  const idsToRemove = new Set();

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
          object.oneToManyRelations[relationName] = [];
          for (const relation of relations) {
            const { to } = relation;
            const toId = `${to.index}-${to.collectionId}`;

            if (ids.has(toId)) {
              oneToMany[relationName].push(relation);
              object.oneToManyRelations[relationName].push(relation);
            } else {
              idsToRemove.add(objectId);
            }
          }
        }

        for (const [relationName, relation] of Object.entries(
          oneToOneRelations
        )) {
          const { to } = relation;
          const toId = `${to.index}-${to.collectionId}`;

          if (ids.has(toId)) {
            oneToOne[relationName].push(relation);
            object.oneToOneRelations[relationName] = relation;
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
}
