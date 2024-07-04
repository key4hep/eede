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
import { recoTrackView, preFilterRecoTrack } from "./recotrack.js";
import { recoClusterView, preFilterRecoCluster } from "./recocluster.js";

export const views = {
  "Monte Carlo Particle Tree": {
    filters: setupMCParticleFilter,
    viewFunction: mcParticleTree,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCTree,
  },
  "Reconstructed Particle Tree": {
    filters: () => {},
    viewFunction: recoParticleTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterRecoTree,
  },
  "Track Tree": {
    filters: () => {},
    viewFunction: trackTree,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterTrackTree,
  },
  "Cluster Tree": {
    filters: () => {},
    viewFunction: clusterTree,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterClusterTree,
  },
  "Reconstructed Particle-Cluster": {
    filters: () => {},
    viewFunction: recoClusterView,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoCluster,
  },
  "Reconstructed Particle-Track": {
    filters: () => {},
    viewFunction: recoTrackView,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoTrack,
  },
  "Monte Carlo-Reconstructed Particle": {
    filters: () => {},
    viewFunction: mcRecoAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCReco,
  },
  "Monte Carlo Particle-Track": {
    filters: () => {},
    viewFunction: mcTrackAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCTrack,
  },
  "Monte Carlo Particle-Cluster": {
    filters: () => {},
    viewFunction: mcClusterAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCCluster,
  },
};
