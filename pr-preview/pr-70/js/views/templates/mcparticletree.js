import { preFilterTree } from "../../filters/pre-filter.js";
import { MCParticle } from "../../types/objects.js";

export function mcParticleTree(viewCurrentObjects) {
  const mcCollection =
    viewCurrentObjects.datatypes["edm4hep::MCParticle"].collection ?? [];

  MCParticle.setRows(mcCollection);

  const getMaxRow = (parentLinks) => {
    let maxRow = -1;
    for (const parentLink of parentLinks) {
      const parent = parentLink.to;
      if (parent.row === -1) {
        return -1;
      }

      if (parent.row > maxRow) {
        maxRow = parent.row;
      }
    }

    return maxRow;
  };

  let repeat = true;
  while (repeat) {
    repeat = false;
    for (const mcParticle of mcCollection) {
      if (mcParticle.row >= 0) {
        continue;
      }
      const parentRow = getMaxRow(mcParticle.oneToManyRelations["parents"]);
      if (parentRow >= 0) {
        mcParticle.row = parentRow + 1;
      } else {
        repeat = true;
      }
    }
  }

  const rows = mcCollection.map((obj) => {
    return obj.row;
  });
  const maxRow = Math.max(...rows);

  // Order infoBoxes into rows
  const mcRows = [];
  for (let i = 0; i <= maxRow; i++) {
    mcRows.push([]);
  }
  for (const box of mcCollection) {
    mcRows[box.row].push(box);
  }
  const rowWidths = mcRows.map((obj) => {
    return obj.length;
  });
  const maxRowWidth = Math.max(...rowWidths);

  const boxWidth = mcCollection[0].width;
  const boxHeight = mcCollection[0].height;
  const horizontalGap = boxWidth * 0.4;
  const verticalGap = boxHeight * 0.3;

  const width =
    boxWidth * (maxRowWidth + 1) + horizontalGap * (maxRowWidth + 1);
  const height = boxHeight * (maxRow + 1) + verticalGap * (maxRow + 2);

  for (const [i, row] of mcRows.entries()) {
    for (const [j, box] of row.entries()) {
      if (row.length % 2 === 0) {
        const distanceFromCenter = j - row.length / 2;
        if (distanceFromCenter < 0) {
          box.x =
            width / 2 -
            boxWidth -
            horizontalGap / 2 +
            (distanceFromCenter + 1) * boxWidth +
            (distanceFromCenter + 1) * horizontalGap;
        } else {
          box.x =
            width / 2 +
            horizontalGap / 2 +
            distanceFromCenter * boxWidth +
            distanceFromCenter * horizontalGap;
        }
      } else {
        const distanceFromCenter = j - row.length / 2;
        box.x =
          width / 2 -
          boxWidth / 2 +
          distanceFromCenter * boxWidth +
          distanceFromCenter * horizontalGap;
      }
      box.y = i * verticalGap + verticalGap + i * boxHeight;
    }
  }

  return [width, height];
}

export function preFilterMCTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::MCParticle", [
    "parents",
    "daughters",
  ]);
}
