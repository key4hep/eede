import { listView } from "./list.js";
import { preFilterList } from "./pre-filter.js";

export function particleIDList(viewCurrentObjects) {
  const vertexCollection =
    viewCurrentObjects.datatypes["edm4hep::ParticleID"].collection ?? [];

  return listView(vertexCollection);
}

export function preFilterParticleIDList(currentObjects, viewObjects) {
  preFilterList(currentObjects, viewObjects, "edm4hep::ParticleID");
}
