export function reconnectAssociation(viewCurrentObjects, ids) {
  const idsToRemove = new Set();

  for (const { collection } of Object.values(viewCurrentObjects.datatypes)) {
    for (const object of collection) {
      const associations = object.associations;

      for (const [associationName, association] of Object.entries(
        associations
      )) {
        const toObject = association.to;
        const toId = `${toObject.index}-${toObject.collectionId}`;

        if (ids.has(toId)) {
          viewCurrentObjects.associations[associationName].push(association);
        } else {
          idsToRemove.add(`${object.index}-${object.collectionId}`);
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
