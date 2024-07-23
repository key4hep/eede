import { preFilterOneWay } from "../filters/pre-filter.js";
import { oneWayView } from "./templates/onewayview.js";

export function recoParticleID(viewObjects) {
  return oneWayView(viewObjects, "edm4hep::ParticleID", "particle");
}

export function preFilterRecoParticleID(currentObjects, viewObjects) {
  preFilterOneWay(
    currentObjects,
    viewObjects,
    "particle",
    "edm4hep::ParticleID",
    "edm4hep::ReconstructedParticle"
  );
}
