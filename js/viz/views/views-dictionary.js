import { layoutMCParticleTree } from "./layoutFunctions/layoutMCParticleTreeTree.js";
import { recoClusterTrackVertex } from "./layoutFunctions/layoutRecoClusterTrackVertex.js";
import { layoutTree } from "./layoutFunctions/layoutTree.js";
import { layoutList } from "./layoutFunctions/layoutList.js";
import { layoutAssociation } from "./layoutFunctions/layoutAssociation.js";
import { layoutOneWay } from "./layoutFunctions/layoutOneWay.js";
import {
  selectMCTree,
  selectRecoTree,
  selectTrackTree,
  selectClusterTree,
  selectRecoClusterTrackVertex,
  selectMCReco,
  selectMCTrack,
  selectMCCluster,
  selectVertexList,
  selectParticleIDList,
  selectRecoParticleID,
} from "./selectorFunctions.js";
import { schemaWithLinks } from "../../state/globals.js";
import { spanWithColor } from "../../lib/utils/html-string.js";
import { positionTopLeft, positionTopCenter } from "./positionFunctions.js";

export const possibleViews = {
  "Monte Carlo Particle Tree": {
    selectorFunction: selectMCTree,
    layoutFunction: layoutMCParticleTree,
    positionFunction: positionTopCenter,
    collections: ["edm4hep::MCParticle"],
    description: `<p>A tree of Monte Carlo particles with their relationships:<ul><li>${spanWithColor(
      "Red",
      "#AA0000",
    )} relations mean parent relation (from bottom to top)</li><li>${spanWithColor(
      "Green",
      "#00AA00",
    )} relations mean daughter relation (from top to bottom).</li></ul></p>`,
  },
  "Reconstructed Particle Tree": {
    selectorFunction: selectRecoTree,
    layoutFunction: (viewCurrentObjects) =>
      layoutTree(
        viewCurrentObjects.datatypes["edm4hep::ReconstructedParticle"]
          .collection ?? [],
        "particles",
      ),
    positionFunction: positionTopLeft,
    collections: ["edm4hep::ReconstructedParticle"],
    description: `<p>A tree of Reconstructed Particles with possible relationships:<ul><li>${spanWithColor(
      "Purple",
      "#AA00AA",
    )} relations mean relation between particles</li></ul></p>`,
  },
  "Track Tree": {
    selectorFunction: selectTrackTree,
    layoutFunction: (viewCurrentObjects) =>
      layoutTree(
        viewCurrentObjects.datatypes["edm4hep::Track"].collection ?? [],
        "tracks",
      ),
    positionFunction: positionTopLeft,
    collections: ["edm4hep::Track"],
    description: `<p>A tree of the Tracks.</p>`,
  },
  "Cluster Tree": {
    selectorFunction: selectClusterTree,
    layoutFunction: (viewCurrentObjects) =>
      layoutTree(
        viewCurrentObjects.datatypes["edm4hep::Cluster"].collection ?? [],
        "clusters",
      ),
    positionFunction: positionTopLeft,
    collections: ["edm4hep::Cluster"],
    description: `<p>A tree of the Clusters.</p>`,
  },
  "RecoParticle-Cluster-Track-Vertex": {
    selectorFunction: selectRecoClusterTrackVertex,
    layoutFunction: recoClusterTrackVertex,
    positionFunction: positionTopCenter,
    collections: [
      "edm4hep::ReconstructedParticle",
      "edm4hep::Cluster",
      "edm4hep::Track",
      "edm4hep::Vertex",
    ],
    description: `<p>Relations that a Reconstruced Particle has with other objects. ${spanWithColor(
      "Green",
      "#AAAA00",
    )} connections are towards Tracks, and ${spanWithColor(
      "sky blue",
      "#00AAAA",
    )} connections are towards Clusters.</p>`,
  },
  "Reconstructed Particle - MC Particle": {
    selectorFunction: selectMCReco,
    positionFunction: positionTopCenter,
    layoutFunction: (viewObjects) => {
      const getTypeName = () =>
        schemaWithLinks()
          ? "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>"
          : "edm4hep::MCRecoParticleAssociation";
      return layoutAssociation(viewObjects, getTypeName());
    },
    collections: ["edm4hep::MCParticle", "edm4hep::ReconstructedParticle"],
    description: `<p>Links between Reconstructed Particles and Monte Carlo Particles, 1:1 relation.</p>`,
  },
  "Track - MC Particle": {
    selectorFunction: selectMCTrack,
    layoutFunction: (viewObjects) =>
      layoutAssociation(viewObjects, "edm4hep::MCRecoTrackParticleAssociation"),
    positionFunction: positionTopCenter,
    collections: ["edm4hep::MCParticle", "edm4hep::Track"],
    description: `<p>Link between Tracks and Monte Carlo Particles, 1:1 relation.</p>`,
  },
  "Cluster - MC Particle": {
    selectorFunction: selectMCCluster,
    layoutFunction: (viewObjects) =>
      layoutAssociation(
        viewObjects,
        "edm4hep::MCRecoClusterParticleAssociation",
      ),
    positionFunction: positionTopCenter,
    collections: ["edm4hep::MCParticle", "edm4hep::Cluster"],
    description: `<p>Link between Clusters and Monte Carlo Particles, 1:1 relation.</p>`,
  },
  "ParticleID List": {
    selectorFunction: selectParticleIDList,
    layoutFunction: (viewCurrentObjects) =>
      layoutList(
        viewCurrentObjects.datatypes["edm4hep::ParticleID"].collection ?? [],
      ),
    positionFunction: positionTopLeft,
    collections: ["edm4hep::ParticleID"],
    description: `<p>A list of ParticleIDs found in the event.</p>`,
  },
  "Vertex List": {
    selectorFunction: selectVertexList,
    layoutFunction: (viewCurrentObjects) =>
      layoutList(
        viewCurrentObjects.datatypes["edm4hep::Vertex"].collection ?? [],
      ),
    positionFunction: positionTopLeft,
    collections: ["edm4hep::Vertex"],
    description: `<p>A list of Vertices found in the event.</p>`,
  },
  "ParticleID-Reconstructed Particle": {
    selectorFunction: selectRecoParticleID,
    layoutFunction: (viewObjects) =>
      layoutOneWay(viewObjects, "edm4hep::ParticleID", "particle"),
    positionFunction: positionTopCenter,
    collections: ["edm4hep::ParticleID", "edm4hep::ReconstructedParticle"],
    description: `<p>1:1 relation from ParticleID to Reconstructed Particle.</p>`,
  },
};
