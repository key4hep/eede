import { objectTypes } from "./objects.js";
import { getSupportedEDM4hepTypes } from "../globals.js";

function loadMembers(object, data, membersToLoad) {
  for (const member of membersToLoad) {
    const name = member.name;
    if (data[name] === undefined) continue; // load up to date data
    object[name] = data[name];
  }
}

function loadEmptyRelations(object, relations) {
  const oneToOneRelations = relations.oneToOneRelations ?? [];
  if (oneToOneRelations) object.oneToOneRelations = {};

  const oneToManyRelations = relations.oneToManyRelations ?? [];
  if (oneToManyRelations) object.oneToManyRelations = {};
  for (const { name } of oneToManyRelations) {
    object.oneToManyRelations[name] = [];
  }
}

export function loadPlainObject(
  collection,
  datatype,
  collectionId,
  collectionName,
  schemaVersion
) {
  const objects = [];
  const supportedEDM4hepTypes = getSupportedEDM4hepTypes(schemaVersion);

  for (const [index, particle] of collection.entries()) {
    const newObject = new objectTypes[datatype]();
    newObject.index = index;
    newObject.collectionId = collectionId;
    newObject.collectionName = collectionName;

    loadMembers(newObject, particle, supportedEDM4hepTypes[datatype].members);
    loadEmptyRelations(newObject, supportedEDM4hepTypes[datatype]);

    objects.push(newObject);
  }

  return objects;
}
