import { MCParticle } from "../objects/MCParticle.js";
import { ReconstructedParticle } from "../objects/ReconstructedParticle.js";
import { Cluster } from "../objects/Cluster.js";
import { Track } from "../objects/Track.js";
import { ParticleID } from "../objects/ParticleID.js";
import { Vertex } from "../objects/Vertex.js";

export const objectTypes = {
  "edm4hep::MCParticle": MCParticle,
  "edm4hep::ReconstructedParticle": ReconstructedParticle,
  "edm4hep::Cluster": Cluster,
  "edm4hep::Track": Track,
  "edm4hep::ParticleID": ParticleID,
  "edm4hep::Vertex": Vertex,
};
