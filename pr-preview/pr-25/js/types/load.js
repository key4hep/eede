import jsonData from "../../input/p8_ee_ZH_ecm240_edm4hep.edm4hep.json" assert { type: "json" }; // node 20
import {
  Cluster,
  ParticleID,
  ReconstructedParticle,
  Vertex,
  Track,
} from "./reconstruction.js";
import { compatible } from "./version.js";

const types = {
  "Cluster": Cluster,
  "ParticleID": ParticleID,
  "ReconstructedParticle": ReconstructedParticle,
  "Vertex": Vertex,
  "Track": Track,
};

const loadersConfig = [
  "ReconstructedParticle",
  "ParticleID",
  "Vertex",
  "Track",
  "Cluster",
];

export function buildLoader(config, version) {
  const newLoader = {};

  if (typeof config === "string") config = [config];

  for (const particle of config) {
    if (types.hasOwnProperty(particle)) {
      const isCompatible = compatible(types[particle], version);

      if (isCompatible) {
        newLoader[particle] = types[particle].load;
      } else {
        newLoader[particle] = () => {
          return [];
        };
      }
    }
  }

  return newLoader;
}

export function loadParticles(jsonData, event, loadersConfig) {
  const eventData = jsonData["Event " + event];
  const version = eventData.edm4hepVersion;

  const loader = buildLoader(loadersConfig, version);

  const particles = {};
  Object.keys(loader).forEach((key) => (particles[key] = []));

  for (const [type, loadFunction] of Object.entries(loader)) {
    const particlesType = Object.values(eventData).filter(
      (element) => element.collType === `edm4hep::${type}Collection`
    );

    particlesType.forEach(({ collection }) => {
      const loadedParticles = loadFunction(collection);
    });
  }

  return particles;
}

loadParticles(jsonData, 4, loadersConfig);
