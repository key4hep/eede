import { preFilterAssociation } from "../filters/pre-filter.js";
import { buildAssociationView } from "./templates/association-view.js";

export function mcTrackAssociation(viewObjects) {
  return buildAssociationView(
    viewObjects,
    "edm4hep::MCRecoTrackParticleAssociation"
  );
}

export function preFilterMCTrack(currentObjects, viewObjects) {
  preFilterAssociation(
    currentObjects,
    viewObjects,
    "edm4hep::MCRecoTrackParticleAssociation",
    "edm4hep::Track",
    "edm4hep::MCParticle"
  );
}
