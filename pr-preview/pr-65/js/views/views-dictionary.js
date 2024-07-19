import { mcParticleTree, preFilterMCTree } from "./mcparticletree.js";
import { mcRecoAssociation, preFilterMCReco } from "./mcrecoassociation.js";
import { recoParticleTree, preFilterRecoTree } from "./recoparticletree.js";
import { setupMCParticleFilter } from "../filter/mcparticle.js";
import { trackTree, preFilterTrackTree } from "./tracktree.js";
import { clusterTree, preFilterClusterTree } from "./clustertree.js";
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
import { spanWithColor } from "../lib/html-string.js";
import { scrollTopCenter } from "../draw/scroll.js";

export const views = {
  "Monte Carlo Particle Tree": {
    filters: setupMCParticleFilter,
    viewFunction: mcParticleTree,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCTree,
    description: `<p>${spanWithColor(
      "Red",
      "#AA0000"
    )} relations mean parent relation (from bottom to top), ${spanWithColor(
      "green",
      "#00AA00"
    )} relations mean daughter relation (from top to bottom).</p>`,
  },
  "Reconstructed Particle Tree": {
    filters: setupNoFilter,
    viewFunction: recoParticleTree,
    scrollFunction: null,
    preFilterFunction: preFilterRecoTree,
    description: `<p>A tree of the Reconstructed Particles. ${spanWithColor(
      "Purple",
      "#AA00AA"
    )} relations mean relation between particles.</p>`,
  },
  "Track Tree": {
    filters: setupNoFilter,
    viewFunction: trackTree,
    scrollFunction: null,
    preFilterFunction: preFilterTrackTree,
    description: `<p>A tree of the Tracks.</p>`,
  },
  "Cluster Tree": {
    filters: setupNoFilter,
    viewFunction: clusterTree,
    scrollFunction: null,
    preFilterFunction: preFilterClusterTree,
    description: `<p>A tree of the Clusters.</p>`,
  },
  "RecoParticle-Cluster-Track-Vertex": {
    filters: setupNoFilter,
    viewFunction: recoClusterTrackVertex,
    scrollFunction: null,
    preFilterFunction: preFilterRecoClusterTrackVertex,
    description: `<p>Relations that a Reconstruced Particle has with other objects. ${spanWithColor(
      "Green",
      "#AAAA00"
    )} connections are towards Tracks, and ${spanWithColor(
      "sky blue",
      "#00AAAA"
    )} connections are towards Clusters.</p>`,
  },
  "Monte Carlo-Reconstructed Particle": {
    filters: setupNoFilter,
    viewFunction: mcRecoAssociation,
    scrollFunction: null,
    preFilterFunction: preFilterMCReco,
    description: `<p>Association between Monte Carlo Particles and Reconstructed Particles. 1:1 relation.</p>`,
  },
  "Monte Carlo Particle-Track": {
    filters: setupNoFilter,
    viewFunction: mcTrackAssociation,
    scrollFunction: null,
    preFilterFunction: preFilterMCTrack,
    description: `<p>Association between Monte Carlo Particles and Tracks. 1:1 relation.</p>`,
  },
  "Monte Carlo Particle-Cluster": {
    filters: setupNoFilter,
    viewFunction: mcClusterAssociation,
    scrollFunction: null,
    preFilterFunction: preFilterMCCluster,
    description: `<p>Association between Monte Carlo Particles and Clusters. 1:1 relation.</p>`,
  },
  "ParticleID List": {
    filters: setupNoFilter,
    viewFunction: particleIDList,
    scrollFunction: null,
    preFilterFunction: preFilterParticleIDList,
    description: `<p>A list of ParticleIDs found in the event.</p>`,
  },
  "Vertex List": {
    filters: setupNoFilter,
    viewFunction: vertexList,
    scrollFunction: null,
    preFilterFunction: preFilterVertexList,
    description: `<p>A list of Vertices found in the event.</p>`,
  },
  "ParticleID-Reconstructed Particle": {
    filters: setupNoFilter,
    viewFunction: recoParticleID,
    scrollFunction: null,
    preFilterFunction: preFilterRecoParticleID,
    description: `<p>1:1 relation from ParticleID to Reconstructed Particle.</p>`,
  },
};
