import { mcParticleTree, preFilterMCTree } from "./templates/mcparticletree.js";
import { mcRecoAssociation, preFilterMCReco } from "./mcrecoassociation.js";
import { recoParticleTree, preFilterRecoTree } from "./recoparticletree.js";
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
} from "./templates/recoclustertrack.js";
import { vertexList, preFilterVertexList } from "./vertexlist.js";
import { particleIDList, preFilterParticleIDList } from "./particleidlist.js";
import { recoParticleID, preFilterRecoParticleID } from "./recoparticleid.js";
import { spanWithColor } from "../lib/html-string.js";
import { scrollTopCenter, scrollTopLeft } from "../draw/scroll.js";
import { reconnectMCParticleTree } from "../filters/reconnect/mcparticletree.js";

export const views = {
  "Monte Carlo Particle Tree": {
    viewFunction: mcParticleTree,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCTree,
    reconnectFunction: reconnectMCParticleTree,
    collections: ["edm4hep::MCParticle"],
    description: `<p>${spanWithColor(
      "Red",
      "#AA0000"
    )} relations mean parent relation (from bottom to top), ${spanWithColor(
      "green",
      "#00AA00"
    )} relations mean daughter relation (from top to bottom).</p>`,
  },
  "Reconstructed Particle Tree": {
    viewFunction: recoParticleTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterRecoTree,
    collections: ["edm4hep::ReconstructedParticle"],
    description: `<p>A tree of the Reconstructed Particles. ${spanWithColor(
      "Purple",
      "#AA00AA"
    )} relations mean relation between particles.</p>`,
  },
  "Track Tree": {
    viewFunction: trackTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterTrackTree,
    collections: ["edm4hep::Track"],
    description: `<p>A tree of the Tracks.</p>`,
  },
  "Cluster Tree": {
    viewFunction: clusterTree,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterClusterTree,
    collections: ["edm4hep::Cluster"],
    description: `<p>A tree of the Clusters.</p>`,
  },
  "RecoParticle-Cluster-Track-Vertex": {
    viewFunction: recoClusterTrackVertex,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoClusterTrackVertex,
    collections: [
      "edm4hep::ReconstructedParticle",
      "edm4hep::Cluster",
      "edm4hep::Track",
      "edm4hep::Vertex",
    ],
    description: `<p>Relations that a Reconstruced Particle has with other objects. ${spanWithColor(
      "Green",
      "#AAAA00"
    )} connections are towards Tracks, and ${spanWithColor(
      "sky blue",
      "#00AAAA"
    )} connections are towards Clusters.</p>`,
  },
  "Monte Carlo-Reconstructed Particle": {
    viewFunction: mcRecoAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCReco,
    collections: ["edm4hep::MCParticle", "edm4hep::ReconstructedParticle"],
    description: `<p>Association between Monte Carlo Particles and Reconstructed Particles. 1:1 relation.</p>`,
  },
  "Monte Carlo Particle-Track": {
    viewFunction: mcTrackAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCTrack,
    collections: ["edm4hep::MCParticle", "edm4hep::Track"],
    description: `<p>Association between Monte Carlo Particles and Tracks. 1:1 relation.</p>`,
  },
  "Monte Carlo Particle-Cluster": {
    viewFunction: mcClusterAssociation,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterMCCluster,
    collections: ["edm4hep::MCParticle", "edm4hep::Cluster"],
    description: `<p>Association between Monte Carlo Particles and Clusters. 1:1 relation.</p>`,
  },
  "ParticleID List": {
    viewFunction: particleIDList,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterParticleIDList,
    collections: ["edm4hep::ParticleID"],
    description: `<p>A list of ParticleIDs found in the event.</p>`,
  },
  "Vertex List": {
    viewFunction: vertexList,
    scrollFunction: scrollTopLeft,
    preFilterFunction: preFilterVertexList,
    collections: ["edm4hep::Vertex"],
    description: `<p>A list of Vertices found in the event.</p>`,
  },
  "ParticleID-Reconstructed Particle": {
    viewFunction: recoParticleID,
    scrollFunction: scrollTopCenter,
    preFilterFunction: preFilterRecoParticleID,
    collections: ["edm4hep::ParticleID", "edm4hep::ReconstructedParticle"],
    description: `<p>1:1 relation from ParticleID to Reconstructed Particle.</p>`,
  },
};
