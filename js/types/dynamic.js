import { createLink } from "./objects.js";

export function loadMembers(object, data, membersToLoad) {
  for (const member of membersToLoad) {
    if (data[member.name] === undefined) continue; // load up to date data
    object.members[member.name] = data[member.name];
  }
}

export function loadOneToOneRelations(object, data, relationsToLoad) {
  object.oneToOneRelations = {};
  for (const relation of relationsToLoad) {
    const relationData = data[relation.name];
    if (relationData === undefined) continue;

    const link = createLink(object.id, object.id, relationData);
    object.oneToOneRelations[relation.name] = link;
  }
}

export function loadOneToManyRelations(object, data, relationsToLoad) {
  object.oneToManyRelations = {};
  for (const relation of relationsToLoad) {
    const name = relation.name;
    const relationData = data[name];

    if (relationData === undefined) continue;
    object.oneToManyRelations[name] = [];

    for (const [index, relationElement] of relationData.entries()) {
      const link = createLink(index + object.id, object.id, relationElement);
      object.oneToManyRelations[name].push(link);
    }
  }
}
