import { preFilterAssociation } from "./pre-filter.js";
import { buildAssociationView } from "./association-view.js";

export function mcTrackAssociation(viewObjects) {
  buildAssociationView(viewObjects, "edm4hep::MCRecoTrackParticleAssociation");
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
