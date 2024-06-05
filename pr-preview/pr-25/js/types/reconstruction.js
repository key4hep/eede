import { dynamicLoad } from "./load.js";

export class Cluster {
  static MIN_VERSION = "0.7.0"; // may vary per type of particle
  static MAX_VERSION = "1.0.0";

  constructor() {
    // Physics properties
    this.type = 0;
    this.energy = 0; // GeV
    this.energyError = 0; // GeV
    this.position = {}; // mm
    this.positionError = {};
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
    const links = createLinksManager(["clusters", "hits"]);

    for (const [index, particle] of collection.entries()) {
      const cluster = new Cluster();
      cluster.index = index;

      extractOneToManyLinks(links, ["clusters", "hits"], cluster, particle);

      dynamicLoad(cluster, particle);

      particles.push(cluster);
    }

    return [particles, links];
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
    this.particle = null;
  }

  static load(collection) {
    const particles = [];
    const links = createLinksManager(["particle"]);

    for (const [index, particle] of collection.entries()) {
      const particleID = new ParticleID();
      particleID.index = index;

      extractOneToOneLink(links, "particle", particleID, particle);

      dynamicLoad(particleID, particle);

      particles.push(particleID);
    }

    return [particles, links];
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
    this.covMatrix = {};
    this.startVertex = null;
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
        reconstructedParticle,
        particle
      );
      extractOneToOneLink(
        links,
        "startVertex",
        reconstructedParticle,
        particle
      );

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
    this.position = {}; // mm
    this.covMatrix = {};
    this.algorithmType = 0;
    this.parameters = 0;
    this.associatedParticle = null;
  }

  static load(collection) {
    const particles = [];
    const links = createLinksManager(["associatedParticle"]);

    for (const [index, particle] of collection.entries()) {
      const vertex = new Vertex();
      vertex.index = index;

      extractOneToOneLink(links, "associatedParticle", vertex, particle);

      dynamicLoad(vertex, particle, new Set(["associatedParticle"]));

      particles.push(vertex);
    }

    return [particles, links];
  }
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
    const links = createLinksManager(["trackerHits", "tracks"]);

    for (const [index, particle] of collection.entries()) {
      const track = new Track();
      track.index = index;

      extractOneToManyLinks(links, ["trackerHits", "tracks"], track, particle);

      dynamicLoad(track, particle);

      particles.push(track);
    }

    return [particles, links];
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

function extractOneToManyLinks(linksManager, keys, newParticle, particleData) {
  for (const key of keys) {
    particleData[key].map((val) => {
      const link = createGenericLink(
        linksManager[key].length,
        newParticle.index,
        val
      );
      linksManager[key].push(link);
      newParticle[key].push(link.id);
    });
  }
}

function extractOneToOneLink(linksManager, key, newParticle, particleData) {
  const link = createGenericLink(
    linksManager[key].length,
    newParticle.index,
    particleData[key]
  );
  linksManager[key].push(link);
  newParticle[key] = link.id;
}
