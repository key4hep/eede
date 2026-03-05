import { buildTree } from "./templates/tree.js";
import { preFilterTree } from "../filters/pre-filter.js";

export function recoParticleTree(viewCurrentObjects) {
  const recoCollection =
    viewCurrentObjects.datatypes["edm4hep::ReconstructedParticle"].collection ??
    [];

  return buildTree(recoCollection, "particles");
}

export function preFilterRecoTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::ReconstructedParticle", [
    "particles",
  ]);
}
