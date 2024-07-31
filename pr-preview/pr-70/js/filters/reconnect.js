import { emptyCopyObject } from "../lib/copy.js";
import { datatypes } from "../../output/datatypes.js";

export function reconnect(
  { viewObjects, viewCurrentObjects },
  criteriaFunctions
) {
  emptyCopyObject(viewObjects, viewCurrentObjects);

  const datatypes = viewObjects.datatypes;
  const associations = viewObjects.associations;

  for (const [collection, criteriaFunction] of Object.entries(
    criteriaFunctions
  )) {
    const originalCollection = datatypes[collection].collection;
    const filteredCollection = originalCollection.filter((object) =>
      criteriaFunction(object)
    );
    viewCurrentObjects.datatypes[collection].collection = filteredCollection;
  }
}
