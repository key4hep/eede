import { preFilterAssociation } from "../filters/pre-filter.js";
import { buildAssociationView } from "./templates/association-view.js";

export function mcClusterAssociation(viewObjects) {
  return buildAssociationView(
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
