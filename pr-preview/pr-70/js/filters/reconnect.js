export function reconnect(viewCurrentObjects, collectionsNames, ids) {
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
