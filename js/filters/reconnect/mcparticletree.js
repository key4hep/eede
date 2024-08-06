import { linkTypes } from "../../types/links.js";

const findParentRow = (object, uniqueRows, rowToIndex) => {
  const thisRowIndex = rowToIndex[object.row];
  if (thisRowIndex > 0 && thisRowIndex < uniqueRows.length) {
    return uniqueRows[thisRowIndex - 1];
  }
  return NaN;
};

const findDaughterRow = (object, uniqueRows, rowToIndex) => {
  const thisRowIndex = rowToIndex[object.row];
  if (thisRowIndex >= 0 && thisRowIndex < uniqueRows.length - 1) {
    return uniqueRows[thisRowIndex + 1];
  }
  return NaN;
};

export function reconnectMCParticleTree(viewCurrentObjects) {
  const { collection, oneToMany } =
    viewCurrentObjects.datatypes["edm4hep::MCParticle"];

  const sortedCollection = collection.sort((a, b) => a.row - b.row);

  const beginRowsIndex = {};
  sortedCollection.forEach((object, index) => {
    if (beginRowsIndex[object.row] === undefined) {
      beginRowsIndex[object.row] = index;
    }
  });

  const rows = sortedCollection.map((object) => object.row);
  const uniqueRows = [...new Set(rows)];

  const rowToIndex = {};
  for (const [index, row] of uniqueRows.entries()) {
    rowToIndex[row] = index;
  }

  const rowToObjectsCount = {};

  sortedCollection.forEach((object) => {
    if (rowToObjectsCount[object.row] === undefined) {
      rowToObjectsCount[object.row] = 1;
      return;
    }
    rowToObjectsCount[object.row] += 1;
  });

  for (const object of sortedCollection) {
    object.saveRelations();

    object.oneToManyRelations = {
      "parents": [],
      "daughters": [],
    };

    console.log(object.row);

    const parentRow = findParentRow(object, uniqueRows, rowToIndex);
    if (parentRow !== NaN) {
      const beginIndex = beginRowsIndex[parentRow];
      const endIndex = beginIndex + rowToObjectsCount[parentRow];

      for (let i = beginIndex; i < endIndex; i++) {
        const newParentLink = new linkTypes["parents"](
          object,
          sortedCollection[i]
        );
        object.oneToManyRelations["parents"].push(newParentLink);
        oneToMany["parents"].push(newParentLink);
      }
    }

    const daughterRow = findDaughterRow(object, uniqueRows, rowToIndex);
    if (daughterRow !== NaN) {
      console.log(daughterRow);
      const beginIndex = beginRowsIndex[daughterRow];
      const endIndex = beginIndex + rowToObjectsCount[daughterRow];

      for (let i = beginIndex; i < endIndex; i++) {
        const newDaughterLink = new linkTypes["daughters"](
          object,
          sortedCollection[i]
        );
        object.oneToManyRelations["daughters"].push(newDaughterLink);
        oneToMany["daughters"].push(newDaughterLink);
      }
    }
  }
}
