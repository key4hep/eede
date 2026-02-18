import { objectTypes } from "../viz/objects/objects.js";
import { supportedEDM4hepTypes } from "../../model/datatypes.js";

export function getSupportedEDM4hepTypes(schemaVersion) {
  return supportedEDM4hepTypes[schemaVersion];
}

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
  dataTypeName,
  collectionId,
  collectionName,
  schemaVersion,
) {
  const objects = [];
  const supportedEDM4hepTypes = getSupportedEDM4hepTypes(schemaVersion);

  for (const [index, collElem] of collection.entries()) {
    const newObject = new objectTypes[dataTypeName]();
    newObject.index = index;
    newObject.collectionId = collectionId;
    newObject.collectionName = collectionName;

    loadMembers(
      newObject,
      collElem,
      supportedEDM4hepTypes[dataTypeName].members,
    );
    loadEmptyRelations(newObject, supportedEDM4hepTypes[dataTypeName]);

    objects.push(newObject);
  }

  return objects;
}
