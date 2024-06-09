import { types } from "./reconstruction.js";
import { compatible } from "./version.js";

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
      const [particles, links] = loadFunction(collection);
    });
  }

  return particles;
}
