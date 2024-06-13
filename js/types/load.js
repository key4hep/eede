import { objectTypes } from "./objects.js";
import { datatypes } from "../../output/datatypes.js";
import {
  loadMembers,
  loadOneToOneRelations,
  loadOneToManyRelations,
} from "./dynamic.js";
import { generateRandomColor, colors } from "./links.js";
import json from "../../input/p8_ee_ZH_ecm240_edm4hep.edm4hep.json" assert { type: "json" };

export function loadObjectType(collection, datatype, type) {
  const objects = [];
  let oneToOne = {};
  if (datatype.oneToOneRelations)
    datatype.oneToOneRelations.forEach((relation) => {
      oneToOne[relation.name] = [];
      if (colors[relation.name] === undefined) {
        colors[relation.name] = generateRandomColor();
      }
    });

  let oneToMany = {};
  if (datatype.oneToManyRelations)
    datatype.oneToManyRelations.forEach((relation) => {
      oneToMany[relation.name] = [];
      if (colors[relation.name] === undefined) {
        colors[relation.name] = generateRandomColor();
      }
    });

  for (const [index, particle] of collection.entries()) {
    const newObject = new type(index);

    loadMembers(newObject, particle, datatype.members);

    loadOneToOneRelations(
      newObject,
      particle,
      datatype.oneToOneRelations,
      oneToOne,
      objects
    );

    loadOneToManyRelations(
      newObject,
      particle,
      datatype.oneToManyRelations,
      oneToMany,
      objects
    );

    objects.push(newObject);
  }

  return [objects, oneToOne, oneToMany];
}

export function loadObjects(jsonData, event, objectsToLoad) {
  const eventData = jsonData["Event " + event];

  const objects = {};

  for (const type of objectsToLoad) {
    let collectionType = Object.values(eventData).filter(
      (element) => element.collType === `${type}Collection`
    );

    collectionType = collectionType.map((coll) => coll.collection);
    collectionType = collectionType.flat();

    const [loadedCollection, oneToOne, oneToMany] = loadObjectType(
      collectionType,
      datatypes[type],
      objectTypes[type]
    );

    objects[type] = {
      collection: loadedCollection,
      oneToMany: oneToMany,
      oneToOne: oneToOne,
    };
  }

  return objects;
}

const objectsToLoad = [
  // subset of datatypes
  // should be changed dynamically by the user
  // "edm4hep::Cluster",
  // "edm4hep::ReconstructedParticle",
  // "edm4hep::Vertex",
  // "edm4hep::Track",
  // "edm4hep::ParticleID",
  "edm4hep::MCParticle",
];
