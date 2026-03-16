export function reconnect(viewCurrentObjects, collectionsNames) {
  for (const collectionName of collectionsNames) {
    const { collection } = viewCurrentObjects.datatypes[collectionName];

    for (const object of collection) {
      const { oneToManyRelations, oneToOneRelations } = object;
      object.saveRelations();

      for (const [relationName] of Object.entries(oneToManyRelations)) {
        object.oneToManyRelations[relationName] = [];
      }

      for (const [relationName] of Object.entries(oneToOneRelations)) {
        object.oneToOneRelations[relationName] = null;
      }
    }
  }
}
