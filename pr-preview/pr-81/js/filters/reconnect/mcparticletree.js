import { linkTypes } from "../../types/links.js";

const findParticles = (otherObject, relationName, ids) => {
  let oneToManyRelations;
  if (otherObject.relations) {
    oneToManyRelations = otherObject.relations.oneToManyRelations;
  } else {
    oneToManyRelations = otherObject.oneToManyRelations;
  }

  const relations = oneToManyRelations[relationName];
  const relationObjects = relations.map((relation) => relation.to);

  if (relationObjects.length === 0) return [];

  const validObjects = relationObjects.filter((object) =>
    ids.has(`${object.index}-${object.collectionId}`)
  );

  return validObjects.length > 0
    ? validObjects
    : relationObjects
        .map((object) => findParticles(object, relationName, ids))
        .flat();
};

export function reconnectMCParticleTree(viewCurrentObjects, ids) {
  const { collection, oneToMany } =
    viewCurrentObjects.datatypes["edm4hep::MCParticle"];

  for (const object of collection) {
    const { oneToManyRelations } = object;
    object.saveRelations();

    const parentRelations = oneToManyRelations["parents"];
    const daughterRelations = oneToManyRelations["daughters"];

    object.oneToManyRelations = {
      "parents": [],
      "daughters": [],
    };

    for (const parentRelation of parentRelations) {
      const parent = parentRelation.to;
      const parentIndex = `${parent.index}-${parent.collectionId}`;

      if (ids.has(parentIndex)) {
        object.oneToManyRelations["parents"].push(parentRelation);
        oneToMany["parents"].push(parentRelation);
      } else {
        const newParents = findParticles(parent, "parents", ids);
        for (const newParent of newParents) {
          const link = new linkTypes["parents"](object, newParent);
          object.oneToManyRelations["parents"].push(link);
          oneToMany["parents"].push(link);
        }
      }
    }

    for (const daughterRelation of daughterRelations) {
      const daughter = daughterRelation.to;
      const daughterIndex = `${daughter.index}-${daughter.collectionId}`;

      if (ids.has(daughterIndex)) {
        object.oneToManyRelations["daughters"].push(daughterRelation);
        oneToMany["daughters"].push(daughterRelation);
      } else {
        const newDaughters = findParticles(daughter, "daughters", ids);
        for (const newDaughter of newDaughters) {
          const link = new linkTypes["daughters"](object, newDaughter);
          object.oneToManyRelations["daughters"].push(link);
          oneToMany["daughters"].push(link);
        }
      }
    }
  }
}
