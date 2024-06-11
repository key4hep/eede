import { objectTypes } from "./objects.js";
import { datatypes } from "../../output/datatypes.js";
import {
  loadMembers,
  loadOneToOneRelations,
  loadOneToManyRelations,
} from "./dynamic.js";

export function loadObjectType(collection, datatype, type) {
  const objects = [];

  for (const [index, particle] of collection.entries()) {
    const newObject = new type();
    newObject.id = index;

    loadMembers(newObject, particle, datatype.members);

    if (datatype.oneToOneRelations)
      loadOneToOneRelations(newObject, particle, datatype.oneToOneRelations);

    if (datatype.oneToManyRelations)
      loadOneToManyRelations(newObject, particle, datatype.oneToManyRelations);

    objects.push(newObject);
  }

  return objects;
}

export function loadObjects(jsonData, event, objectsToLoad) {
  const eventData = jsonData["Event " + event];

  const objects = {};

  for (const type of objectsToLoad) {
    const objectsType = Object.values(eventData).filter(
      (element) => element.collType === `${type}Collection`
    );

    objectsType.forEach(({ collection }) => {
      loadObjectType(collection, datatypes[type], objectTypes[type]);
    });
  }

  return objects;
}

const objectsToLoad = [
  // subset of datatypes
  // should be changes dynamically by the user
  "edm4hep::Cluster",
  "edm4hep::ReconstructedParticle",
  "edm4hep::Vertex",
  "edm4hep::Track",
  "edm4hep::ParticleID",
  "edm4hep::MCParticle",
];
