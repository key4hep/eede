export class Cluster {
  constructor() {
    // Physics properties
    this.type = 0;
    this.energy = 0; // GeV
    this.energyError = 0; // GeV
    this.position = []; // mm
    this.positionError = [];
    this.iTheta = 0;
    this.phi = 0;
    this.directionError = {}; // mm^2
    this.shapeParameters = [];
    this.subdetectorEnergies = [];
    this.clusters = [];
    this.hits = [];
  }

  static load(collection) {
    const particles = [];

    for (const [index, particle] of collection.entries()) {
      const cluster = new Cluster();
      cluster.index = index;

      cluster.type = particle.type;
      cluster.energy = particle.energy;
      cluster.energyError = particle.energyError;
      cluster.position = particle.position;
      cluster.positionError = particle.positionError;
      cluster.iTheta = particle.iTheta;
      cluster.phi = particle.phi;
      cluster.directionError = particle.directionError;
      cluster.shapeParameters = particle.shapeParameters;
      cluster.subdetectorEnergies = particle.subdetectorEnergies;
      cluster.clusters = particle.clusters;
      cluster.hits = particle.hits;

      particles.push(cluster);
    }

    return particles;
  }
}

export class ParticleID {
  constructor() {
    // Physics properties
    this.type = 0;
    this.pdg = 0;
    this.algorithmType = 0;
    this.likelihood = 0;
    this.parameters = [];
    this.particle = [];
  }

  static load(collection) {
    const particles = [];

    for (const [index, particle] of collection.entries()) {
      const particleID = new ParticleID();
      particleID.index = index;

      particleID.type = particle.type;
      particleID.pdg = particle.pdg;
      particleID.algorithmType = particle.algorithmType;
      particleID.likelihood = particle.likelihood;
      particleID.parameters = particle.parameters;

      particles.push(particleID);
    }

    return particles;
  }
}

export class ReconstructedParticle {
  constructor() {
    // Physics properties
    this.pdg = 0;
    this.energy = 0; // GeV
    this.momentum = {}; // GeV
    this.referencePoint = {}; // mm
    this.charge = 0;
    this.mass = 0; // GeV
    this.goodnessOfPID = 0;
    this.covMatrix = [];
    this.startVertex = {};
    this.clusters = [];
    this.tracks = [];
    this.particles = [];
  }

  static load(collection) {
    const particles = [];

    for (const [index, particle] of collection.entries()) {
      const reconstructedParticle = new ReconstructedParticle();
      reconstructedParticle.index = index;

      reconstructedParticle.energy = particle.energy;
      reconstructedParticle.momentum = particle.momentum;
      reconstructedParticle.referencePoint = particle.referencePoint;
      reconstructedParticle.charge = particle.charge;
      reconstructedParticle.mass = particle.mass;
      reconstructedParticle.goodnessOfPID = particle.goodnessOfPID;
      reconstructedParticle.covMatrix = particle.covMatrix;
      reconstructedParticle.startVertex = particle.startVertex;
      reconstructedParticle.clusters = particle.clusters;
      reconstructedParticle.tracks = particle.tracks;
      reconstructedParticle.particles = particle.particles;

      particles.push(reconstructedParticle);
    }

    return particles;
  }
}

export class Vertex {
  constructor() {
    // Physics properties
    this.primary = 0;
    this.chi2 = 0;
    this.probability = 0;
    this.position = 0; // mm
    this.covMatrix = [];
    this.algorithmType = 0;
    this.parameters = 0;
    this.associatedParticles = [];
  }

  static load() {}
}

export class Track {
  constructor() {
    // Physics properties
    this.type = 0;
    this.chi2 = 0;
    this.ndf = 0;
    this.dEdx = 0;
    this.dEdxError = 0;
    this.radiusOfInnermostHit = 0;
    this.subdetectorHitNumbers = [];
    this.trackStates = [];
    this.dxQuantities = [];
    this.trackerHits = [];
    this.tracks = [];
  }

  static load(collection) {
    const particles = [];

    for (const [index, particle] of collection.entries()) {
      const track = new Track();
      track.index = index;

      track.type = particle.type;
      track.chi2 = particle.chi2;
      track.ndf = particle.ndf;
      track.dEdx = particle.dEdx;
      track.dEdxError = particle.dEdxError;
      track.radiusOfInnermostHit = particle.radiusOfInnermostHit;
      track.subdetectorHitNumbers = particle.subdetectorHitNumbers;
      track.trackStates = particle.trackStates;
      track.dxQuantities = particle.dxQuantities;
      track.trackerHits = particle.trackerHits;
      track.tracks = particle.tracks;

      particles.push(track);
    }

    return particles;
  }
}
