import { datatypes } from "../../../output/datatypes.js";
import { linkTypes } from "../../types/links.js";

export function reconnectTree(viewCurrentObjects, ids) {
  const tree = Object.entries(viewCurrentObjects.datatypes).filter(
    ([_, { collection }]) => collection.length !== 0
  )[0];
  const collectionName = tree[0];
  const { collection: unsortedCollection } = tree[1];
  const sortedCollection = unsortedCollection.sort((a, b) => a.row - b.row);
  const rows = sortedCollection.map((object) => object.row);
  const uniqueRows = [...new Set(rows)];
  uniqueRows.sort((a, b) => a - b);

  const beginRowsIndex = {};
  sortedCollection.forEach((object, index) => {
    if (beginRowsIndex[object.row] === undefined) {
      beginRowsIndex[object.row] = index;
    }
  });

  const rowsCount = {};
  rows.forEach((row) => {
    if (rowsCount[row] === undefined) {
      rowsCount[row] = 1;
      return;
    }
    rowsCount[row] += 1;
  });

  // Assuming al trees are oneToManyRelations
  const relationName = datatypes[collectionName].oneToManyRelations.filter(
    ({ type }) => type === collectionName
  )[0].name;
  const relationClass = linkTypes[relationName];

  for (const object of sortedCollection) {
    object.saveRelations();

    object.oneToManyRelations = {
      [relationName]: [],
    };

    const objectRow = object.row;
    const nextRow = objectRow + 1;

    if (beginRowsIndex[nextRow] !== undefined) {
      const beginIndex = beginRowsIndex[nextRow];
      const count = rowsCount[nextRow];
      const endIndex = beginIndex + count;

      for (let i = beginIndex; i < endIndex; i++) {
        const daughter = sortedCollection[i];
        const daughterId = `${daughter.index}-${daughter.collectionId}`;

        if (ids.has(daughterId)) {
          const relation = new relationClass(object, daughter);
          object.oneToManyRelations[relationName].push(relation);
          viewCurrentObjects.datatypes[collectionName].oneToMany[
            relationName
          ].push(relation);
        }
      }
    }
  }
}
