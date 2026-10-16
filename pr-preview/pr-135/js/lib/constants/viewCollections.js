export const viewCollections = {
  monteCarlo: ["edm4hep::MCParticle"],
  reco: ["edm4hep::ReconstructedParticle"],
  track: ["edm4hep::Track"],
  cluster: ["edm4hep::Cluster"],
  recoClusterTrackVertex: [
    "edm4hep::ReconstructedParticle",
    "edm4hep::Cluster",
    "edm4hep::Track",
    "edm4hep::Vertex",
  ],
  monteCarloReco: ["edm4hep::MCParticle", "edm4hep::ReconstructedParticle"],
  monteCarloTrack: ["edm4hep::MCParticle", "edm4hep::Track"],
  monteCarloCluster: ["edm4hep::MCParticle", "edm4hep::Cluster"],
  particleId: ["edm4hep::ParticleID"],
  vertex: ["edm4hep::Vertex"],
  recoParticleID: ["edm4hep::ParticleID", "edm4hep::ReconstructedParticle"],
};
