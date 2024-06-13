import { Link, colors } from "./links.js";

export function loadMembers(object, data, membersToLoad) {
  for (const member of membersToLoad) {
    if (data[member.name] === undefined) continue; // load up to date data
    object.members[member.name] = data[member.name];
  }
}

export function loadOneToOneRelations(
  object,
  data,
  relationsToLoad = [],
  oneToOne,
  objects
) {
  object.oneToOneRelations = {};
  for (const relation of relationsToLoad) {
    const name = relation.name;
    const relationData = data[name];
    if (relationData === undefined) continue;

    const toObject = objects[relationData.index];
    const link = new Link(object, toObject);
    link.color = colors[name];

    oneToOne[name].push(link);
    object.oneToOneRelations[name] = link;
  }
}

export function loadOneToManyRelations(
  object,
  data,
  relationsToLoad = [],
  oneToMany,
  objects
) {
  object.oneToManyRelations = {};
  for (const relation of relationsToLoad) {
    const name = relation.name;
    const relationData = data[name];

    if (relationData === undefined) continue;
    object.oneToManyRelations[name] = [];

    for (const relationElement of relationData) {
      const toObject = objects[relationElement.index];
      const link = new Link(object, toObject);
      link.color = colors[name];
      oneToMany[name].push(link);
      object.oneToManyRelations[name].push(link);
    }
  }
}
