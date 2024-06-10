import { reconstructionTypes } from "./reconstruction.js";
import { datatypes } from "../../output/datatypes.js";
import {
  loadMembers,
  loadOneToOneRelations,
  loadOneToManyRelations,
} from "./dynamic.js";

export function loadParticleType(collection, datatype, type) {
  const particles = [];

  for (const [index, particle] of collection.entries()) {
    const newParticle = new type();
    newParticle.id = index;

    loadMembers(newParticle, particle, datatype.members);

    if (datatype.oneToOneRelations)
      loadOneToOneRelations(newParticle, particle, datatype.oneToOneRelations);

    if (datatype.oneToManyRelations)
      loadOneToManyRelations(
        newParticle,
        particle,
        datatype.oneToManyRelations
      );

    particles.push(newParticle);
  }

  return particles;
}

export function loadParticles(jsonData, event, particlesToLoad) {
  const eventData = jsonData["Event " + event];

  const particles = {};

  for (const type of particlesToLoad) {
    const particlesType = Object.values(eventData).filter(
      (element) => element.collType === `${type}Collection`
    );

    particlesType.forEach(({ collection }) => {
      loadParticleType(collection, datatypes[type], reconstructionTypes[type]);
    });
  }

  return particles;
}

const particlesToLoad = [
  // subset of datatypes
  "edm4hep::Cluster",
  "edm4hep::ReconstructedParticle",
  "edm4hep::Vertex",
  "edm4hep::Track",
  "edm4hep::ParticleID",
];
