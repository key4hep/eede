import { preFilterOneToMany } from "./pre-filter.js";
import { oneToManyView } from "./oneToMany.js";

export function recoClusterView(viewCurrentObjects) {
  oneToManyView(
    viewCurrentObjects,
    "edm4hep::ReconstructedParticle",
    "edm4hep::Cluster",
    "clusters"
  );
}

export function preFilterRecoCluster(currentObjects, viewObjects) {
  preFilterOneToMany(
    currentObjects,
    viewObjects,
    "edm4hep::ReconstructedParticle",
    "edm4hep::Cluster",
    "clusters"
  );
}
