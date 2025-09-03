import { preFilterAssociation } from "../filters/pre-filter.js";
import { buildAssociationView } from "./templates/association-view.js";
import { schemaWithLinks } from "../globals.js";

export function mcRecoAssociation(visObjects) {
  let linkCollTypeName = "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>";
  if (!schemaWithLinks()) {
    linkCollTypeName = "edm4hep::MCRecoParticleAssociation";
  }
  return buildAssociationView(
    visObjects,
    linkCollTypeName
  );
}

export function preFilterMCReco(currentVisObjects, viewObjects) {
  let linkCollTypeName = "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>";
  if (!schemaWithLinks()) {
    linkCollTypeName = "edm4hep::MCRecoParticleAssociation";
  }
  preFilterAssociation(
    currentVisObjects,
    viewObjects,
    linkCollTypeName,
    "edm4hep::ReconstructedParticle",
    "edm4hep::MCParticle"
  );
}
