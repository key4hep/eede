import { MCParticle } from "../../viz/items/itemMCParticle.js";
import { ReconstructedParticle } from "../../viz/items/itemReconstructedParticle.js";
import { Cluster } from "../../viz/items/itemCluster.js";
import { Track } from "../../viz/items/itemTrack.js";
import { ParticleID } from "../../viz/items/itemParticleID.js";
import { Vertex } from "../../viz/items/itemVertex.js";

export const objectTypes = {
  "edm4hep::MCParticle": MCParticle,
  "edm4hep::ReconstructedParticle": ReconstructedParticle,
  "edm4hep::Cluster": Cluster,
  "edm4hep::Track": Track,
  "edm4hep::ParticleID": ParticleID,
  "edm4hep::Vertex": Vertex,
};
