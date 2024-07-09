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
  recoClusterTrack,
  preFilterRecoClusterTrack,
} from "./recoclustertrack.js";
import { setupNoFilter } from "../filter/nofilter.js";

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
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterTrackTree,
  },
  "Cluster Tree": {
    filters: setupNoFilter,
    viewFunction: clusterTree,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterClusterTree,
  },
  "Reco Particle-Cluster-Track": {
    filters: setupNoFilter,
    viewFunction: recoClusterTrack,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoClusterTrack,
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
};
