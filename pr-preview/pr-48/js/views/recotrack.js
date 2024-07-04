import { preFilterOneToMany } from "./pre-filter.js";
import { oneToManyView } from "./oneToMany.js";

export function recoTrackView(viewCurrentObjects) {
  oneToManyView(
    viewCurrentObjects,
    "edm4hep::ReconstructedParticle",
    "edm4hep::Track",
    "tracks"
  );
}

export function preFilterRecoTrack(currentObjects, viewObjects) {
  preFilterOneToMany(
    currentObjects,
    viewObjects,
    "edm4hep::ReconstructedParticle",
    "edm4hep::Track",
    "tracks"
  );
}
