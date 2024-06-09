import { Particle } from "./particle.js";

class Reconstruction extends Particle {
  constructor() {
    super();
  }
}

export class Cluster extends Reconstruction {
  constructor() {
    super();
  }
}

export class ParticleID extends Reconstruction {
  constructor() {
    super();
  }
}

export class ReconstructedParticle extends Reconstruction {
  constructor() {
    super();
  }
}

export class Vertex extends Reconstruction {
  constructor() {
    super();
  }
}

export class Track extends Reconstruction {
  constructor() {
    super();
  }
}

export class GenericLink {
  // we may create a specific class for each type if needed
  constructor(id, from, to, collectionID) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.collectionID = collectionID;
  }
}

export function createLink(id, from, { collectionID, index }) {
  return new GenericLink(id, from, index, collectionID);
}

export const reconstructionTypes = {
  "edm4hep::Cluster": Cluster,
  "edm4hep::ParticleID": ParticleID,
  "edm4hep::ReconstructedParticle": ReconstructedParticle,
  "edm4hep::Vertex": Vertex,
  "edm4hep::Track": Track,
};
