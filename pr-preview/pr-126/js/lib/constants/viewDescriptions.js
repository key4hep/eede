import { spanWithColor } from "../../lib/utils/html-string.js";

export const viewDescriptions = {
  monteCarlo: `<p>A tree of Monte Carlo particles with their relationships:<ul><li>${spanWithColor(
    "Red",
    "#AA0000",
  )} relations mean parent relation (from bottom to top)</li><li>${spanWithColor(
    "Green",
    "#00AA00",
  )} relations mean daughter relation (from top to bottom).</li></ul></p>`,
  reco: `<p>A tree of Reconstructed Particles with possible relationships:<ul><li>${spanWithColor(
    "Purple",
    "#AA00AA",
  )} relations mean relation between particles</li></ul></p>`,
  track: `<p>A tree of the Tracks.</p>`,
  cluster: `<p>A tree of the Clusters.</p>`,
  recoClusterTrackVertex: `<p>Relations that a Reconstruced Particle has with other objects. ${spanWithColor(
    "Green",
    "#AAAA00",
  )} connections are towards Tracks, and ${spanWithColor(
    "sky blue",
    "#00AAAA",
  )} connections are towards Clusters.</p>`,
  monteCarloReco: `<p>Links between Reconstructed Particles and Monte Carlo Particles, 1:1 relation.</p>`,
  monteCarloTrack: `<p>Link between Tracks and Monte Carlo Particles, 1:1 relation.</p>`,
  monteCarloCluster: `<p>Link between Clusters and Monte Carlo Particles, 1:1 relation.</p>`,
  particleId: `<p>A list of ParticleIDs found in the event.</p>`,
  vertex: `<p>A list of Vertices found in the event.</p>`,
  recoParticleID: `<p>1:1 relation from ParticleID to Reconstructed Particle.</p>`,
};
