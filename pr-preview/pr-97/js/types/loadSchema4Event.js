import { linkTypes } from "./links.js";
import { getSupportedEDM4hepTypes } from "../globals.js";
import { loadPlainObject } from "./loadObjects.js";


export function handleSchema4Event(eventData) {
  const visObjects = {
    "datatypes": {},
    "associations": {},
  };

  const supportedEDM4hepTypes = getSupportedEDM4hepTypes('4');

  // Select only Datatype collections
  const supportedDataTypeNames = Object.keys(supportedEDM4hepTypes).filter(
    (type) => {
      if (type.includes("Link")) {
        return false;
      }

      return true;
    }
  );

  // Select only Link collections
  const supportedLinkNames = Object.keys(supportedEDM4hepTypes).filter((object) =>
    object.includes("Link")
  );

  supportedDataTypeNames.forEach((dataTypeName) => {
    visObjects.datatypes[dataTypeName] = {
      collection: [],
      oneToMany: {},
      oneToOne: {},
    };
  });

  supportedLinkNames.forEach((linkName) => {
    visObjects.associations[linkName] = [];
  });

  for (const dataTypeName of supportedDataTypeNames) {
    const supportedCollName = `${dataTypeName}Collection`;
    const possibleOneToOneRelations = supportedEDM4hepTypes[dataTypeName].oneToOneRelations ?? [];
    const possibleOneToManyRelations = supportedEDM4hepTypes[dataTypeName].oneToManyRelations ?? [];

    for (const [collName, collObj] of Object.entries(eventData)) {
      if (collObj.collType !== supportedCollName) {
        continue;
      }

      const collection = collObj.collection;
      const collectionId = collObj.collID;

      if (collection.length === 0) {
        continue;
      }

      // console.log(`Loading collection: ${collObj.collType}`);
      // console.log(`  - size: ${collection.length}`);
      // console.log(collObj);

      // Check for subset collection
      // TODO: Do not ignore subset collections
      if (collObj.isSubsetColl) {
        continue;
      }

      const objectCollection = loadPlainObject(
        collection,
        dataTypeName,
        collectionId,
        collName,
        '4'
      );
      visObjects.datatypes[dataTypeName].collection.push(...objectCollection);
    }

    possibleOneToOneRelations.forEach((relation) => {
      visObjects.datatypes[dataTypeName].oneToOne[relation.name] = [];
    });

    possibleOneToManyRelations.forEach((relation) => {
      visObjects.datatypes[dataTypeName].oneToMany[relation.name] = [];
    });
  }

  for (const dataTypeName of supportedDataTypeNames) {
    const supportedCollType = `${dataTypeName}Collection`;
    const possibleOneToOneRelations = supportedEDM4hepTypes[dataTypeName].oneToOneRelations ?? [];
    const possibleOneToManyRelations = supportedEDM4hepTypes[dataTypeName].oneToManyRelations ?? [];

    for (const collObj of Object.values(eventData)) {
      if (collObj.collType !== supportedCollType) {
        continue;
      }

      const fromVisCollection = visObjects.datatypes[dataTypeName].collection.filter(
        (object) => object.collectionId === collObj.collID
      );
      if (!fromVisCollection) {
        continue;
      }

      // Load One To One Relations
      possibleOneToOneRelations.forEach((rel) => {
        if (!(rel.type in visObjects.datatypes)) {
          return;
        }

        const oneToOneRelationData = collObj.collection
          .map((object) => object[rel.name])
          .filter((object) => object !== undefined)
          .map((object) => object[0]);

        if (oneToOneRelationData.length === 0) {
          return;
        }

        const toCollectionID =
          oneToOneRelationData.find(
            (relation) => "collectionID" in relation
          ).collectionID ?? null;

        if (!toCollectionID) {
          return;
        }

        const toVisCollection = visObjects.datatypes[rel.type].collection.filter(
          (object) => object.collectionId === toCollectionID
        );

        if (!toVisCollection) {
          return;
        }

        for (const [index, relation] of oneToOneRelationData.entries()) {
          if (relation.index < 0) {
            continue;
          }

          const fromObject = fromVisCollection[index];
          if (!fromObject) {
            continue;
          }
          const toObject = toVisCollection[relation.index];
          if (!toObject) {
            continue;
          }

          const linkType = linkTypes[rel.name];
          const link = new linkType(fromObject, toObject);
          fromObject.oneToOneRelations[rel.name] = link;
          visObjects.datatypes[dataTypeName].oneToOne[rel.name].push(link);
        }
      });

      // Load One To Many Relations
      possibleOneToManyRelations.forEach((rel) => {
        // console.log(`rel.name: ${rel.name}, rel.type: ${rel.type}`);
        if (!(rel.type in visObjects.datatypes)) {
          return;
        }

        const oneToManyRelationData = collObj.collection
          .map((object) => object[rel.name])
          .filter((object) => object !== undefined);

        if (oneToManyRelationData.length === 0) {
          return;
        }

        const toCollectionID =
          oneToManyRelationData.find(
            (relation) => relation?.[0]?.collectionID !== undefined
          )?.[0]?.collectionID ?? null;

        if (!toCollectionID) {
          return;
        }

        const toCollection = visObjects.datatypes[rel.type].collection.filter(
          (object) => object.collectionId === toCollectionID
        );

        for (const [index, relation] of oneToManyRelationData.entries()) {
          if (relation.length === 0) {
            continue;
          }

          const fromObject = fromVisCollection[index];
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

            const linkType = linkTypes[rel.name];
            const link = new linkType(fromObject, toObject);
            fromObject.oneToManyRelations[rel.name].push(link);
            visObjects.datatypes[dataTypeName].oneToMany[rel.name].push(link);
          }
        }
      });
    }
  }

  // Currently, all links are one-to-one
  for (const linkCollectionName of supportedLinkNames) {
    Object.values(eventData).forEach((element) => {
      if (element.collType === linkCollectionName) {
        const collection = element.collection;
        if (collection.length === 0) return;

        // console.log(`Loading link collection: ${linkCollectionName}`);
        // console.log(`  - size: ${collection.length}`);

        const { type: fromType, name: fromName } =
          supportedEDM4hepTypes[linkCollectionName].oneToOneRelations[0];
        const { type: toType, name: toName } =
          supportedEDM4hepTypes[linkCollectionName].oneToOneRelations[1];

        const fromCollectionID = collection.find(
          (relation) => relation[fromName].collectionID !== undefined
        )[fromName].collectionID;
        const toCollectionID = collection.find(
          (relation) => relation[toName].collectionID !== undefined
        )[toName].collectionID;

        const fromCollection = visObjects.datatypes[fromType].collection.filter(
          (object) => object.collectionId === fromCollectionID
        );
        const toCollection = visObjects.datatypes[toType].collection.filter(
          (object) => object.collectionId === toCollectionID
        );

        for (const associationElement of collection) {
          const fromObject = fromCollection[associationElement[fromName].index];
          const toObject = toCollection[associationElement[toName].index];

          const linkType = linkTypes[linkCollectionName];
          const link = new linkType(
            fromObject,
            toObject,
            associationElement.weight
          );
          visObjects.associations[linkCollectionName].push(link);
          fromObject.associations = {};
          fromObject.associations[linkCollectionName] = link;
          toObject.associations = {};
          toObject.associations[linkCollectionName] = link;
        }
      }
    });
  }

  return visObjects;
}
