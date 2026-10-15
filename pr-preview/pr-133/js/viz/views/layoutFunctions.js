import { positionTree } from "./positionItems/positionTree.js";
import { positionList } from "./positionItems/positionList.js";
import { positionAssociation } from "./positionItems/positionAssociation.js";
import { positionOneWay } from "./positionItems/positionOneWay.js";
import { positionMonteCarlo } from "./positionItems/positionMCParticleTree.js";
import { positionRecoClusterTrackVertex } from "./positionItems/positionRecoClusterTrackVertex.js";
import { schemaWithLinks } from "../../state/globals.js";

export {
  positionMonteCarlo as layoutMonteCarlo,
  positionRecoClusterTrackVertex as layoutRecoClusterTrackVertex,
};

export function layoutReco(viewCurrentObjects) {
  return positionTree(
    viewCurrentObjects.datatypes["edm4hep::ReconstructedParticle"].collection ??
      [],
    "particles",
  );
}

export function layoutTrack(viewCurrentObjects) {
  return positionTree(
    viewCurrentObjects.datatypes["edm4hep::Track"].collection ?? [],
    "tracks",
  );
}

export function layoutCluster(viewCurrentObjects) {
  return positionTree(
    viewCurrentObjects.datatypes["edm4hep::Cluster"].collection ?? [],
    "clusters",
  );
}

export function layoutParticleId(viewCurrentObjects) {
  return positionList(
    viewCurrentObjects.datatypes["edm4hep::ParticleID"].collection ?? [],
  );
}

export function layoutVertex(viewCurrentObjects) {
  return positionList(
    viewCurrentObjects.datatypes["edm4hep::Vertex"].collection ?? [],
  );
}

export function layoutMonteCarloReco(viewObjects) {
  const typeName = schemaWithLinks()
    ? "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>"
    : "edm4hep::MCRecoParticleAssociation";
  return positionAssociation(viewObjects, typeName);
}

export function layoutMonteCarloTrack(viewObjects) {
  return positionAssociation(
    viewObjects,
    "edm4hep::MCRecoTrackParticleAssociation",
  );
}

export function layoutMonteCarloCluster(viewObjects) {
  return positionAssociation(
    viewObjects,
    "edm4hep::MCRecoClusterParticleAssociation",
  );
}

export function layoutRecoParticleId(viewObjects) {
  return positionOneWay(viewObjects, "edm4hep::ParticleID", "particle");
}
