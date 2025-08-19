import { objectTypes } from "./objects.js";
import { datatypes } from "../../output/datatypes.js";
import { linkTypes } from "./links.js";

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
  collectionName
) {
  const objects = [];

  for (const [index, particle] of collection.entries()) {
    const newObject = new objectTypes[datatype]();
    newObject.index = index;
    newObject.collectionId = collectionId;
    newObject.collectionName = collectionName;

    loadMembers(newObject, particle, datatypes[datatype].members);
    loadEmptyRelations(newObject, datatypes[datatype]);

    objects.push(newObject);
  }

  return objects;
}

export function loadObjects(fileData, eventNum, objectsToLoad) {
  const eventData = fileData["Event " + eventNum];

  if (eventData === undefined) {
    return;
  }

  const datatypesToLoad = objectsToLoad.filter(
    (object) => {
      if (object.includes("Association")) {
        return false;
      }
      if (object.includes("Link")) {
        return false;
      }

      return true;
    }
  );
  const associations = objectsToLoad.filter((object) =>
    object.includes("Association")
  );

  const objects = {
    "datatypes": {},
    "associations": {},
  };

  datatypesToLoad.forEach((datatype) => {
    objects.datatypes[datatype] = {
      collection: [],
      oneToMany: {},
      oneToOne: {},
    };
  });

  associations.forEach((association) => {
    objects.associations[association] = [];
  });

  for (const typeName of datatypesToLoad) {
    for (const collName in eventData) {
      const fullTypeName = `${typeName}Collection`;
      if (eventData[collName].collType !== fullTypeName) {
        continue;
      }

      const collection = eventData[collName].collection;
      const collectionId = eventData[collName].collID;

      if (collection.length === 0) {
        continue;
      }

      // Check for subset collection
      // TODO: Do not ignore subset collections
      if ('index' in collection[0] && 'collectionID' in collection[0]) {
        continue;
      }

      const objectCollection = loadPlainObject(
        collection,
        typeName,
        collectionId,
        collName
      );
      objects.datatypes[typeName].collection.push(...objectCollection);
    }
  }

  for (const datatype of datatypesToLoad) {
    const possibleOneToOneRelations = datatypes?.[datatype]?.oneToOneRelations ?? [];
    possibleOneToOneRelations.forEach((relation) => {
      objects.datatypes[datatype].oneToOne[relation.name] = [];
    });

    const possibleOneToManyRelations = datatypes?.[datatype]?.oneToManyRelations ?? [];
    possibleOneToManyRelations.forEach((relation) => {
      objects.datatypes[datatype].oneToMany[relation.name] = [];
    });

    Object.values(eventData).forEach((element) => {
      const collectionName = `${datatype}Collection`;
      if (element.collType === collectionName) {
        const fromCollection = objects.datatypes[datatype].collection.filter(
          (object) => object.collectionId === element.collID
        );

        // load One To One Relations
        for (const { type, name } of possibleOneToOneRelations) {
          if (objects.datatypes?.[type] === undefined) continue;
          const oneToOneRelationData = element.collection
            .map((object) => object[name])
            .filter((object) => object !== undefined);

          if (oneToOneRelationData.length === 0) continue;

          const toCollectionID =
            oneToOneRelationData.find(
              (relation) => relation.collectionID !== undefined
            ).collectionID ?? NaN;

          const toCollection = objects.datatypes[type].collection.filter(
            (object) => object.collectionId === toCollectionID
          );

          if (toCollection) {
            for (const [index, relation] of oneToOneRelationData.entries()) {
              if (relation.index < 0) continue;
              const fromObject = fromCollection[index];
              const toObject = toCollection[relation.index];

              const linkType = linkTypes[name];
              const link = new linkType(fromObject, toObject);
              fromObject.oneToOneRelations[name] = link;
              objects.datatypes[datatype].oneToOne[name].push(link);
            }
          }
        }

        // load One To Many Relations
        for (const { type, name } of possibleOneToManyRelations) {
          if (objects.datatypes?.[type] === undefined) continue;
          const oneToManyRelationData = element.collection
            .map((object) => object[name])
            .filter((object) => object !== undefined);

          if (oneToManyRelationData.length === 0) continue;

          const toCollectionID =
            oneToManyRelationData.find(
              (relation) => relation?.[0]?.collectionID !== undefined
            )?.[0]?.collectionID ?? NaN;
          const toCollection = objects.datatypes[type].collection.filter(
            (object) => object.collectionId === toCollectionID
          );

          if (toCollection) {
            for (const [index, relation] of oneToManyRelationData.entries()) {
              if (relation.length === 0) continue;
              const fromObject = fromCollection[index];
              for (const relationElement of relation) {
                if (relationElement.index < 0) continue;
                const toObject = toCollection[relationElement.index];

                const linkType = linkTypes[name];
                const link = new linkType(fromObject, toObject);
                fromObject.oneToManyRelations[name].push(link);
                objects.datatypes[datatype].oneToMany[name].push(link);
              }
            }
          }
        }
      }
    });
  }

  // Currently, all associations are one-to-one
  for (const association of associations) {
    Object.values(eventData).forEach((element) => {
      const collectionName = `${association}Collection`;
      if (element.collType === collectionName) {
        const collection = element.collection;
        if (collection.length === 0) return;

        const { type: fromType, name: fromName } =
          datatypes[association].oneToOneRelations[0];
        const { type: toType, name: toName } =
          datatypes[association].oneToOneRelations[1];

        const fromCollectionID = collection.find(
          (relation) => relation[fromName].collectionID !== undefined
        )[fromName].collectionID;
        const toCollectionID = collection.find(
          (relation) => relation[toName].collectionID !== undefined
        )[toName].collectionID;

        const fromCollection = objects.datatypes[fromType].collection.filter(
          (object) => object.collectionId === fromCollectionID
        );
        const toCollection = objects.datatypes[toType].collection.filter(
          (object) => object.collectionId === toCollectionID
        );

        for (const associationElement of collection) {
          const fromObject = fromCollection[associationElement[fromName].index];
          const toObject = toCollection[associationElement[toName].index];

          const linkType = linkTypes[association];
          const link = new linkType(
            fromObject,
            toObject,
            associationElement.weight
          );
          objects.associations[association].push(link);
          fromObject.associations = {};
          fromObject.associations[association] = link;
          toObject.associations = {};
          toObject.associations[association] = link;
        }
      }
    });
  }

  return objects;
}
