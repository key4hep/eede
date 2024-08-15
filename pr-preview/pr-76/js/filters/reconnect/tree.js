import { datatypes } from "../../../output/datatypes.js";

export function reconnectTree(viewCurrentObjects, ids) {
  const tree = Object.entries(viewCurrentObjects.datatypes).filter(
    ([_, { collection }]) => collection.length !== 0
  )[0];
  const collectionName = tree[0];
  const { collection } = tree[1];

  // Assuming al trees are oneToManyRelations
  const relationName = datatypes[collectionName].oneToManyRelations.filter(
    ({ type }) => type === collectionName
  )[0].name;

  for (const object of collection) {
    const { oneToManyRelations } = object;
    const oldRelations = oneToManyRelations[relationName];
    object.saveRelations();

    object.oneToManyRelations = {
      [relationName]: [],
    };

    for (const relation of oldRelations) {
      const child = relation.to;
      const childIndex = `${child.index}-${child.collectionId}`;

      if (ids.has(childIndex)) {
        object.oneToManyRelations[relationName].push(relation);
        viewCurrentObjects.datatypes[collectionName].oneToMany[
          relationName
        ].push(relation);
      }
    }
  }
}
