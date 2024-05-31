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

function selectedParticles(loaders, particles) {
  let newLoader = {};

  for (const particle of particles) {
    if (loaders.hasOwnProperty(particle)) {
      newLoader[particle] = loaders[particle];
    }
  }

  return newLoader;
}

export function loadParticles(event, loadersConfig) {
  const eventData = Object.values(jsonData["Event " + event]);

  const particles = [];

  const loader = selectedParticles(loaders, loadersConfig);

  for (const [type, loadFunction] of Object.entries(loader)) {
    const particlesType = eventData.filter(
      (element) => element.collType === `edm4hep::${type}Collection`
    );

    particlesType.forEach((collection) => {
      const loadedParticles = loadFunction(collection.collection);
    });
  }
  try {
  } catch (error) {
    console.error(error);
  }

  return particles;
}

loadParticles(4, loadersConfig);
