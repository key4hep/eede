import { buildTree } from "./buildStructures/buildTree.js";
import { buildAssociation } from "./buildStructures/buildAssociation.js";
import { buildList } from "./buildStructures/buildList.js";
import { buildOneWay } from "./buildStructures/buildOneWay.js";
import { buildRecoClusterTrackVertex } from "./buildStructures/buildRecoClusterTrackVertex.js";
import { schemaWithLinks } from "../../state/globals.js";

export function selectMonteCarlo(currentObjects, viewObjects) {
  buildTree(currentObjects, viewObjects, "edm4hep::MCParticle", [
    "parents",
    "daughters",
  ]);
}

export function selectReco(currentObjects, viewObjects) {
  buildTree(currentObjects, viewObjects, "edm4hep::ReconstructedParticle", [
    "particles",
  ]);
}

export function selectTrack(currentObjects, viewObjects) {
  buildTree(currentObjects, viewObjects, "edm4hep::Track", ["tracks"]);
}

export function selectCluster(currentObjects, viewObjects) {
  buildTree(currentObjects, viewObjects, "edm4hep::Cluster", ["clusters"]);
}

export function selectRecoClusterTrackVertex(currentObjects, viewObjects) {
  buildRecoClusterTrackVertex(currentObjects, viewObjects);
}

export function selectMonteCarloReco(currentVisObjects, viewObjects) {
  let linkCollTypeName =
    "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>";
  if (!schemaWithLinks()) {
    linkCollTypeName = "edm4hep::MCRecoParticleAssociation";
  }

  buildAssociation(
    currentVisObjects,
    viewObjects,
    linkCollTypeName,
    "edm4hep::ReconstructedParticle",
    "edm4hep::MCParticle",
  );
}

export function selectMonteCarloTrack(currentObjects, viewObjects) {
  buildAssociation(
    currentObjects,
    viewObjects,
    "edm4hep::MCRecoTrackParticleAssociation",
    "edm4hep::Track",
    "edm4hep::MCParticle",
  );
}

export function selectMonteCarloCluster(currentObjects, viewObjects) {
  buildAssociation(
    currentObjects,
    viewObjects,
    "edm4hep::MCRecoClusterParticleAssociation",
    "edm4hep::Cluster",
    "edm4hep::MCParticle",
  );
}

export function selectVertex(currentObjects, viewObjects) {
  buildList(currentObjects, viewObjects, "edm4hep::Vertex");
}

export function selectParticleId(currentObjects, viewObjects) {
  buildList(currentObjects, viewObjects, "edm4hep::ParticleID");
}

export function selectRecoParticleId(currentObjects, viewObjects) {
  buildOneWay(
    currentObjects,
    viewObjects,
    "particle",
    "edm4hep::ParticleID",
    "edm4hep::ReconstructedParticle",
  );
}
