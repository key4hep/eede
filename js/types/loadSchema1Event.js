import { linkTypes } from "./links.js";
import { getSupportedEDM4hepTypes } from "../globals.js";
import { loadPlainObject } from "./loadObjects.js";


export function handleSchema1Event(eventData) {
  const objects = {
    "datatypes": {},
    "associations": {},
  };

  const supportedEDM4hepTypes = getSupportedEDM4hepTypes('1');

  // Select only Datatype collections
  const supportedDataTypes = Object.keys(supportedEDM4hepTypes).filter(
    (type) => {
      if (type.includes("Association")) {
        return false;
      }
      if (type.includes("Link")) {
        return false;
      }

      return true;
    }
  );

  // Select only Link collections
  const supportedAssociations = Object.keys(supportedEDM4hepTypes).filter((object) =>
    object.includes("Association")
  );

  supportedDataTypes.forEach((typeName) => {
    objects.datatypes[typeName] = {
      collection: [],
      oneToMany: {},
      oneToOne: {},
    };
  });

  supportedAssociations.forEach((association) => {
    objects.associations[association] = [];
  });

  for (const supportedDataType of supportedDataTypes) {
    const supportedCollName = `${supportedDataType}Collection`;
    for (const collName in eventData) {
      if (eventData[collName].collType !== supportedCollName) {
        continue;
      }

      const collection = eventData[collName].collection;
      const collectionId = eventData[collName].collID;

      if (collection.length === 0) {
        continue;
      }

      // console.log(`Loading collection: ${supportedCollName}`);
      // console.log(`  - size: ${collection.length}`);

      // Check for subset collection
      // TODO: Do not ignore subset collections
      if ('index' in collection[0] && 'collectionID' in collection[0]) {
        continue;
      }

      const objectCollection = loadPlainObject(
        collection,
        supportedDataType,
        collectionId,
        collName,
        '1'
      );
      objects.datatypes[supportedDataType].collection.push(...objectCollection);
    }
  }

  for (const typeName of supportedDataTypes) {
    const possibleOneToOneRelations = supportedEDM4hepTypes[typeName].oneToOneRelations ?? [];
    possibleOneToOneRelations.forEach((relation) => {
      objects.datatypes[typeName].oneToOne[relation.name] = [];
    });

    const possibleOneToManyRelations = supportedEDM4hepTypes[typeName].oneToManyRelations ?? [];
    possibleOneToManyRelations.forEach((relation) => {
      objects.datatypes[typeName].oneToMany[relation.name] = [];
    });

    Object.values(eventData).forEach((element) => {
      const collectionName = `${typeName}Collection`;
      if (element.collType === collectionName) {
        const fromCollection = objects.datatypes[typeName].collection.filter(
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
              objects.datatypes[typeName].oneToOne[name].push(link);
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
            )?.[0]?.collectionID ?? null;

          if (!toCollectionID) {
            continue;
          }

          const toCollection = objects.datatypes[type].collection.filter(
            (object) => object.collectionId === toCollectionID
          );

          for (const [index, relation] of oneToManyRelationData.entries()) {
            if (relation.length === 0) {
              continue;
            }

            const fromObject = fromCollection[index];
            if (!fromObject) {
              continue;
            }

            for (const relationElement of relation) {
              if (relationElement.index < 0) {
                continue;
              }

              const toObject = toCollection[relationElement.index];
              if (!toObject) {
                continue;
              }

              const linkType = linkTypes[name];
              const link = new linkType(fromObject, toObject);
              fromObject.oneToManyRelations[name].push(link);
              objects.datatypes[typeName].oneToMany[name].push(link);
            }
          }
        }
      }
    });
  }

  // Currently, all associations are one-to-one
  for (const association of supportedAssociations) {
    Object.values(eventData).forEach((element) => {
      const collectionName = `${association}Collection`;
      if (element.collType === collectionName) {
        const collection = element.collection;
        if (collection.length === 0) return;

        // console.log(`Loading collection: ${collectionName}`);
        // console.log(`  - size: ${collection.length}`);

        const { type: fromType, name: fromName } =
          supportedEDM4hepTypes[association].oneToOneRelations[0];
        const { type: toType, name: toName } =
          supportedEDM4hepTypes[association].oneToOneRelations[1];

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
