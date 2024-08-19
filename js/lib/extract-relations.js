import { datatypes } from "../../output/datatypes.js";

export function getRelationsFromCollections(collections) {
  const collectionsSet = new Set(collections);
  const relationsFromCollection = new Set();

  collections.forEach((collection) => {
    const { oneToOneRelations, oneToManyRelations } = datatypes[collection];

    if (oneToManyRelations) {
      oneToManyRelations.forEach(({ type, name }) => {
        if (collectionsSet.has(type) && type !== collection) {
          relationsFromCollection.add(name);
        }
      });
    }

    if (oneToOneRelations) {
      oneToOneRelations.forEach(({ type, name }) => {
        if (collectionsSet.has(type) && type !== collection) {
          relationsFromCollection.add(name);
        }
      });
    }
  });

  return relationsFromCollection;
}
