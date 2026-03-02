import { MCParticle } from "./MCParticle.js";
import { ReconstructedParticle } from "./ReconstructedParticle.js";
import { Cluster } from "./Cluster.js";
import { Track } from "./Track.js";
import { ParticleID } from "./ParticleID.js";
import { Vertex } from "./Vertex.js";

export const objectTypes = {
  "edm4hep::MCParticle": MCParticle,
  "edm4hep::ReconstructedParticle": ReconstructedParticle,
  "edm4hep::Cluster": Cluster,
  "edm4hep::Track": Track,
  "edm4hep::ParticleID": ParticleID,
  "edm4hep::Vertex": Vertex,
};
