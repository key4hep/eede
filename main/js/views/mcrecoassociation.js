import { preFilterAssociation } from "../filters/pre-filter.js";
import { buildAssociationView } from "./templates/association-view.js";

export function mcRecoAssociation(viewObjects) {
  return buildAssociationView(
    viewObjects,
    "edm4hep::MCRecoParticleAssociation"
  );
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
