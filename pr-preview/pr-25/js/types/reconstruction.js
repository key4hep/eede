import { dynamicLoad } from "./load.js";

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
    const links = createLinksManager([
      "tracks",
      "clusters",
      "particles",
      "startVertex",
    ]);

    for (const [index, particle] of collection.entries()) {
      const reconstructedParticle = new ReconstructedParticle();
      reconstructedParticle.index = index;

      extractOneToManyLinks(
        links,
        ["tracks", "clusters", "particles"],
        particle
      );
      extractOneToOneLinks(links, "startVertex", particle);

      dynamicLoad(
        reconstructedParticle,
        particle,
        new Set(["tracks", "clusters", "particles", "startVertex"])
      );

      particles.push(reconstructedParticle);
    }

    return [particles, links];
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

export class GenericLink {
  // we may create a specific class for each type if needed
  constructor(id, from, to) {
    this.id = id;
    this.from = from;
    this.to = to;
  }
}

function createLinksManager(types) {
  const links = {};
  types.forEach((type) => (links[type] = []));
  return links;
}

export function createGenericLink(id, from, { collectionID, index }) {
  const genericLink = new GenericLink(id, from, index);
  genericLink.collectionID = collectionID;
  return genericLink;
}

function extractOneToManyLinks(linksManager, keys, particle) {
  for (const key of keys) {
    particle[key].map((val) => {
      const link = createGenericLink(
        linksManager[key].length,
        particle.index,
        val
      );
      linksManager[key].push(link);
      particle[key].push(link.id);
    });
  }
}

function extractOneToOneLinks(linksManager, key, particle) {
  const link = createGenericLink(
    linksManager[key].length,
    particle.index,
    particle[key]
  );
  linksManager[key].push(link);
  particle[key] = link.id;
}
