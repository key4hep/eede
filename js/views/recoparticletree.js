import { buildTree } from "./tree.js";
import { preFilterTree } from "./pre-filter.js";

export function recoParticleTree(viewCurrentObjects) {
  const recoCollection =
    viewCurrentObjects.datatypes["edm4hep::ReconstructedParticle"].collection ??
    [];

  buildTree(recoCollection, "particles");
}

export function preFilterRecoTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::ReconstructedParticle", [
    "particles",
  ]);
}
