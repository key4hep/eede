import { mcParticleTree } from "./templates/mcparticletree.js";
import { recoClusterTrackVertex } from "./templates/recoclustertrack.js";
import { buildTree } from "./templates/tree.js";
import { listView } from "./templates/list.js";
import { buildAssociationView } from "./templates/association-view.js";
import { oneWayView } from "./templates/onewayview.js";
import {
  preFilterMCTree,
  preFilterRecoTree,
  preFilterTrackTree,
  preFilterClusterTree,
  preFilterRecoClusterTrackVertex,
  preFilterMCReco,
  preFilterMCTrack,
  preFilterMCCluster,
  preFilterVertexList,
  preFilterParticleIDList,
  preFilterRecoParticleID,
} from "./pre-filters.js";
import { schemaWithLinks } from "../../globals.js";
import { spanWithColor } from "../lib/html-string.js";
import { setViewportPosition, getContainerSize } from "../draw/app.js";

const scrollTopLeft = () => {
  setViewportPosition(0, 0);
};

const scrollTopCenter = () => {
  const { width } = getContainerSize();
  setViewportPosition(width / 2, 500);
};

export const possibleViews = {
  "Monte Carlo Particle Tree": {
    preFilterFunction: preFilterMCTree,
    viewFunction: mcParticleTree,
    scrollFunction: scrollTopCenter,
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
    preFilterFunction: preFilterRecoTree,
    viewFunction: (viewCurrentObjects) =>
      buildTree(
        viewCurrentObjects.datatypes["edm4hep::ReconstructedParticle"]
          .collection ?? [],
        "particles",
      ),
    scrollFunction: scrollTopLeft,
    collections: ["edm4hep::ReconstructedParticle"],
    description: `<p>A tree of Reconstructed Particles with possible relationships:<ul><li>${spanWithColor(
      "Purple",
      "#AA00AA",
    )} relations mean relation between particles</li></ul></p>`,
  },
  "Track Tree": {
    preFilterFunction: preFilterTrackTree,
    viewFunction: (viewCurrentObjects) =>
      buildTree(
        viewCurrentObjects.datatypes["edm4hep::Track"].collection ?? [],
        "tracks",
      ),
    scrollFunction: scrollTopLeft,
    collections: ["edm4hep::Track"],
    description: `<p>A tree of the Tracks.</p>`,
  },
  "Cluster Tree": {
    preFilterFunction: preFilterClusterTree,
    viewFunction: (viewCurrentObjects) =>
      buildTree(
        viewCurrentObjects.datatypes["edm4hep::Cluster"].collection ?? [],
        "clusters",
      ),
    scrollFunction: scrollTopLeft,
    collections: ["edm4hep::Cluster"],
    description: `<p>A tree of the Clusters.</p>`,
  },
  "RecoParticle-Cluster-Track-Vertex": {
    preFilterFunction: preFilterRecoClusterTrackVertex,
    viewFunction: recoClusterTrackVertex,
    scrollFunction: scrollTopCenter,
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
    preFilterFunction: preFilterMCReco,
    scrollFunction: scrollTopCenter,
    viewFunction: (viewObjects) => {
      const getTypeName = () =>
        schemaWithLinks()
          ? "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>"
          : "edm4hep::MCRecoParticleAssociation";
      return buildAssociationView(viewObjects, getTypeName());
    },
    collections: ["edm4hep::MCParticle", "edm4hep::ReconstructedParticle"],
    description: `<p>Links between Reconstructed Particles and Monte Carlo Particles, 1:1 relation.</p>`,
  },
  "Track - MC Particle": {
    preFilterFunction: preFilterMCTrack,
    viewFunction: (viewObjects) =>
      buildAssociationView(
        viewObjects,
        "edm4hep::MCRecoTrackParticleAssociation",
      ),
    scrollFunction: scrollTopCenter,
    collections: ["edm4hep::MCParticle", "edm4hep::Track"],
    description: `<p>Link between Tracks and Monte Carlo Particles, 1:1 relation.</p>`,
  },
  "Cluster - MC Particle": {
    preFilterFunction: preFilterMCCluster,
    viewFunction: (viewObjects) =>
      buildAssociationView(
        viewObjects,
        "edm4hep::MCRecoClusterParticleAssociation",
      ),
    scrollFunction: scrollTopCenter,
    collections: ["edm4hep::MCParticle", "edm4hep::Cluster"],
    description: `<p>Link between Clusters and Monte Carlo Particles, 1:1 relation.</p>`,
  },
  "ParticleID List": {
    preFilterFunction: preFilterParticleIDList,
    viewFunction: (viewCurrentObjects) =>
      listView(
        viewCurrentObjects.datatypes["edm4hep::ParticleID"].collection ?? [],
      ),
    scrollFunction: scrollTopLeft,
    collections: ["edm4hep::ParticleID"],
    description: `<p>A list of ParticleIDs found in the event.</p>`,
  },
  "Vertex List": {
    preFilterFunction: preFilterVertexList,
    viewFunction: (viewCurrentObjects) =>
      listView(
        viewCurrentObjects.datatypes["edm4hep::Vertex"].collection ?? [],
      ),
    scrollFunction: scrollTopLeft,
    collections: ["edm4hep::Vertex"],
    description: `<p>A list of Vertices found in the event.</p>`,
  },
  "ParticleID-Reconstructed Particle": {
    preFilterFunction: preFilterRecoParticleID,
    viewFunction: (viewObjects) =>
      oneWayView(viewObjects, "edm4hep::ParticleID", "particle"),
    scrollFunction: scrollTopCenter,
    collections: ["edm4hep::ParticleID", "edm4hep::ReconstructedParticle"],
    description: `<p>1:1 relation from ParticleID to Reconstructed Particle.</p>`,
  },
};
