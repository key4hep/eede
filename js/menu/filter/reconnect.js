import { emptyCopyObject } from "../../lib/copy.js";
import { objectTypes } from "../../types/objects.js";

export function reconnect(criteriaFunction, loadedObjects) {
  const filteredObjects = {};

  emptyCopyObject(loadedObjects, filteredObjects);

  const filterFunction = objectTypes["edm4hep::MCParticle"].filter;

  const mcParticles = loadedObjects.datatypes["edm4hep::MCParticle"];

  filterFunction(mcParticles, filteredObjects.datatypes, criteriaFunction);

  return filteredObjects;
}
