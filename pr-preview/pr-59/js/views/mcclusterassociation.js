import { preFilterAssociation } from "./pre-filter.js";
import { buildAssociationView } from "./association-view.js";

export function mcClusterAssociation(viewObjects) {
  buildAssociationView(
    viewObjects,
    "edm4hep::MCRecoClusterParticleAssociation"
  );
}

export function preFilterMCCluster(currentObjects, viewObjects) {
  preFilterAssociation(
    currentObjects,
    viewObjects,
    "edm4hep::MCRecoClusterParticleAssociation",
    "edm4hep::Cluster",
    "edm4hep::MCParticle"
  );
}
