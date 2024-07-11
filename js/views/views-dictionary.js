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
  },
  "Reconstructed Particle Tree": {
    filters: setupNoFilter,
    viewFunction: recoParticleTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterRecoTree,
  },
  "Track Tree": {
    filters: setupNoFilter,
    viewFunction: trackTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterTrackTree,
  },
  "Cluster Tree": {
    filters: setupNoFilter,
    viewFunction: clusterTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterClusterTree,
  },
  "RecoParticle-Cluster-Track-Vertex": {
    filters: setupNoFilter,
    viewFunction: recoClusterTrackVertex,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoClusterTrackVertex,
  },
  "Monte Carlo-Reconstructed Particle": {
    filters: setupNoFilter,
    viewFunction: mcRecoAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCReco,
  },
  "Monte Carlo Particle-Track": {
    filters: setupNoFilter,
    viewFunction: mcTrackAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCTrack,
  },
  "Monte Carlo Particle-Cluster": {
    filters: setupNoFilter,
    viewFunction: mcClusterAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCCluster,
  },
  "ParticleID List": {
    filters: setupNoFilter,
    viewFunction: particleIDList,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterParticleIDList,
  },
  "Vertex List": {
    filters: setupNoFilter,
    viewFunction: vertexList,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterVertexList,
  },
  "ParticleID-Reconstructed Particle": {
    filters: setupNoFilter,
    viewFunction: recoParticleID,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoParticleID,
  },
};
