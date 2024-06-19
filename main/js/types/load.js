import { objectTypes } from "./objects.js";
import { datatypes } from "../../output/datatypes.js";
import {
  loadMembers,
  loadOneToOneRelations,
  loadOneToManyRelations,
} from "./dynamic.js";
import { generateRandomColor, colors } from "./links.js";

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

    objects.push(newObject);
  }

  for (const [index, particle] of collection.entries()) {
    const newObject = objects[index];

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
