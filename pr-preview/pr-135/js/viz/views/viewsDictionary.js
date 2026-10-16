import {
  layoutMonteCarlo,
  layoutRecoClusterTrackVertex,
  layoutReco,
  layoutTrack,
  layoutCluster,
  layoutParticleId,
  layoutVertex,
  layoutMonteCarloReco,
  layoutMonteCarloTrack,
  layoutMonteCarloCluster,
  layoutRecoParticleId,
} from "./layoutFunctions.js";
import {
  selectMonteCarlo,
  selectReco,
  selectTrack,
  selectCluster,
  selectRecoClusterTrackVertex,
  selectMonteCarloReco,
  selectMonteCarloTrack,
  selectMonteCarloCluster,
  selectVertex,
  selectParticleId,
  selectRecoParticleId,
} from "./selectorFunctions.js";
import { positionTopLeft, positionTopCenter } from "./positionFunctions.js";
import { viewCollections } from "../../lib/constants/viewCollections.js";
import { viewDescriptions } from "../../lib/constants/viewDescriptions.js";

export const possibleViews = {
  "Monte Carlo Particle Tree": {
    selectorFunction: selectMonteCarlo,
    layoutFunction: layoutMonteCarlo,
    positionFunction: positionTopCenter,
    collections: viewCollections.monteCarlo,
    description: viewDescriptions.monteCarlo,
  },
  "Reconstructed Particle Tree": {
    selectorFunction: selectReco,
    layoutFunction: layoutReco,
    positionFunction: positionTopLeft,
    collections: viewCollections.reco,
    description: viewDescriptions.reco,
  },
  "Track Tree": {
    selectorFunction: selectTrack,
    layoutFunction: layoutTrack,
    positionFunction: positionTopLeft,
    collections: viewCollections.track,
    description: viewDescriptions.track,
  },
  "Cluster Tree": {
    selectorFunction: selectCluster,
    layoutFunction: layoutCluster,
    positionFunction: positionTopLeft,
    collections: viewCollections.cluster,
    description: viewDescriptions.cluster,
  },
  "RecoParticle-Cluster-Track-Vertex": {
    selectorFunction: selectRecoClusterTrackVertex,
    layoutFunction: layoutRecoClusterTrackVertex,
    positionFunction: positionTopCenter,
    collections: viewCollections.recoClusterTrackVertex,
    description: viewDescriptions.cluster,
  },
  "Reconstructed Particle - MC Particle": {
    selectorFunction: selectMonteCarloReco,
    layoutFunction: layoutMonteCarloReco,
    positionFunction: positionTopCenter,
    collections: viewCollections.monteCarloReco,
    description: viewDescriptions.monteCarloReco,
  },
  "Track - MC Particle": {
    selectorFunction: selectMonteCarloTrack,
    layoutFunction: layoutMonteCarloTrack,
    positionFunction: positionTopCenter,
    collections: viewCollections.monteCarloTrack,
    description: viewDescriptions.monteCarloTrack,
  },
  "Cluster - MC Particle": {
    selectorFunction: selectMonteCarloCluster,
    layoutFunction: layoutMonteCarloCluster,
    positionFunction: positionTopCenter,
    collections: viewCollections.monteCarloCluster,
    description: viewDescriptions.monteCarloCluster,
  },
  "ParticleID List": {
    selectorFunction: selectParticleId,
    layoutFunction: layoutParticleId,
    positionFunction: positionTopLeft,
    collections: viewCollections.particleId,
    description: viewDescriptions.particleId,
  },
  "Vertex List": {
    selectorFunction: selectVertex,
    layoutFunction: layoutVertex,
    positionFunction: positionTopLeft,
    collections: viewCollections.vertex,
    description: viewDescriptions.vertex,
  },
  "ParticleID-Reconstructed Particle": {
    selectorFunction: selectRecoParticleId,
    layoutFunction: layoutRecoParticleId,
    positionFunction: positionTopCenter,
    collections: viewCollections.recoParticleID,
    description: viewDescriptions.recoParticleID,
  },
};
