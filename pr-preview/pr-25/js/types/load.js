import jsonData from "../../input/p8_ee_ZH_ecm240_edm4hep.edm4hep.json" assert { type: "json" }; // node 20
import {
  Cluster,
  ParticleID,
  ReconstructedParticle,
  Vertex,
  Track,
} from "./reconstruction.js";

const loaders = {
  ReconstructedParticle: ReconstructedParticle.load,
  ParticleID: ParticleID.load,
  Vertex: Vertex.load,
  Track: Track.load,
  Cluster: Cluster.load,
};

const loadersConfig = [
  "ReconstructedParticle",
  "ParticleID",
  "Vertex",
  "Track",
  "Cluster",
];

export function buildLoader(config) {
  let newLoader = {
    types: {},
    getLoader: (name) => {
      if (newLoader.types.hasOwnProperty(name)) {
        return newLoader.types[name];
      }
      return false;
    },
    getAllLoaders: () => {
      return newLoader.types;
    },
  };

  for (const particle of config) {
    if (loaders.hasOwnProperty(particle)) {
      newLoader.types[particle] = loaders[particle];
    }
  }

  return newLoader;
}

export function loadParticles(jsonData, event, loadersConfig) {
  const eventData = Object.values(jsonData["Event " + event]);

  const particles = {};

  if (typeof loadersConfig === "string") loadersConfig = [loadersConfig];
  const loader = buildLoader(loadersConfig);

  Object.keys(loader.getAllLoaders()).forEach((key) => (particles[key] = []));

  for (const [type, loadFunction] of Object.entries(loader.getAllLoaders())) {
    const particlesType = eventData.filter(
      (element) => element.collType === `edm4hep::${type}Collection`
    );

    particlesType.forEach((collection) => {
      const loadedParticles = loadFunction(collection.collection);
      particles[type] = loadedParticles;
    });
  }

  return particles;
}

loadParticles(jsonData, 4, loadersConfig);
