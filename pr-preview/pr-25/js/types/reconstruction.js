function dynamicLoad(object, data, ignore = null) {
  if (ignore !== null) {
    for (const key of ignore) {
      delete data[key];
    }
  }

  for (const [key, value] of Object.entries(data)) {
    object[key] = value;
  }
}

export class Cluster {
  static MIN_VERSION = "0.7.0"; // may vary per type of particle
  static MAX_VERSION = "1.0.0";

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

      dynamicLoad(cluster, particle);

      particles.push(cluster);
    }

    return particles;
  }
}

export class ParticleID {
  static MIN_VERSION = "0.7.0";
  static MAX_VERSION = "1.0.0";

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

      dynamicLoad(particleID, particle);

      particles.push(particleID);
    }

    return particles;
  }
}

export class ReconstructedParticle {
  static MIN_VERSION = "0.7.0";
  static MAX_VERSION = "1.0.0";

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

      dynamicLoad(reconstructedParticle, particle);

      particles.push(reconstructedParticle);
    }

    return particles;
  }
}

export class Vertex {
  static MIN_VERSION = "0.7.0";
  static MAX_VERSION = "1.0.0";

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
  static MIN_VERSION = "0.7.0";
  static MAX_VERSION = "1.0.0";

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

      dynamicLoad(track, particle);

      particles.push(track);
    }

    return particles;
  }
}
