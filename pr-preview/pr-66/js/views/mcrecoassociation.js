import { preFilterAssociation } from "./pre-filter.js";
import { buildAssociationView } from "./association-view.js";

export function mcRecoAssociation(viewObjects) {
  buildAssociationView(viewObjects, "edm4hep::MCRecoParticleAssociation");
}

export function preFilterMCReco(currentObjects, viewObjects) {
  preFilterAssociation(
    currentObjects,
    viewObjects,
    "edm4hep::MCRecoParticleAssociation",
    "edm4hep::ReconstructedParticle",
    "edm4hep::MCParticle"
  );
}
