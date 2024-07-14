import { mcParticleTree, preFilterMCTree } from "./mcparticletree.js";
import { mcRecoAssociation, preFilterMCReco } from "./mcrecoassociation.js";
import { recoParticleTree, preFilterRecoTree } from "./recoparticletree.js";
import { setupMCParticleFilter } from "../filter/mcparticle.js";
import { trackTree, preFilterTrackTree } from "./tracktree.js";
import { clusterTree, preFilterClusterTree } from "./clustertree.js";
import { scrollTopCenter, scrollTopLeft } from "./scrolls.js";
import { preFilterMCTrack, mcTrackAssociation } from "./mctrackassociation.js";
import {
  preFilterMCCluster,
  mcClusterAssociation,
} from "./mcclusterassociation.js";
import {
  recoClusterTrackVertex,
  preFilterRecoClusterTrackVertex,
} from "./recoclustertrack.js";
import { setupNoFilter } from "../filter/nofilter.js";
import { vertexList, preFilterVertexList } from "./vertexlist.js";
import { particleIDList, preFilterParticleIDList } from "./particleidlist.js";
import { recoParticleID, preFilterRecoParticleID } from "./recoparticleid.js";

export const views = {
  "Monte Carlo Particle Tree": {
    filters: setupMCParticleFilter,
    viewFunction: mcParticleTree,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCTree,
    description:
      "Red relations mean parent relation (from bottom to top), green relations mean daughter relation (from top to bottom).",
  },
  "Reconstructed Particle Tree": {
    filters: setupNoFilter,
    viewFunction: recoParticleTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterRecoTree,
    description:
      "A tree of the Reconstructed Particles. Purple relations mean relation between particles.",
  },
  "Track Tree": {
    filters: setupNoFilter,
    viewFunction: trackTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterTrackTree,
    description: "A tree of the Tracks.",
  },
  "Cluster Tree": {
    filters: setupNoFilter,
    viewFunction: clusterTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterClusterTree,
    description: "A tree of the Clusters.",
  },
  "RecoParticle-Cluster-Track-Vertex": {
    filters: setupNoFilter,
    viewFunction: recoClusterTrackVertex,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoClusterTrackVertex,
    description:
      "Relations that a Reconstruced Particle has with other objects. Green connections are towards Tracks, and sky blue connections are towards Clusters.",
  },
  "Monte Carlo-Reconstructed Particle": {
    filters: setupNoFilter,
    viewFunction: mcRecoAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCReco,
    description:
      "Association between Monte Carlo Particles and Reconstructed Particles. 1:1 relation.",
  },
  "Monte Carlo Particle-Track": {
    filters: setupNoFilter,
    viewFunction: mcTrackAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCTrack,
    description:
      "Association between Monte Carlo Particles and Tracks. 1:1 relation.",
  },
  "Monte Carlo Particle-Cluster": {
    filters: setupNoFilter,
    viewFunction: mcClusterAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCCluster,
    description:
      "Association between Monte Carlo Particles and Clusters. 1:1 relation.",
  },
  "ParticleID List": {
    filters: setupNoFilter,
    viewFunction: particleIDList,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterParticleIDList,
    description: "A list of ParticleIDs found in the event.",
  },
  "Vertex List": {
    filters: setupNoFilter,
    viewFunction: vertexList,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterVertexList,
    description: "A list of Vertices found in the event.",
  },
  "ParticleID-Reconstructed Particle": {
    filters: setupNoFilter,
    viewFunction: recoParticleID,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoParticleID,
    description: "1:1 relation from ParticleID to Reconstructed Particle.",
  },
};
