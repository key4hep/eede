import { setCurrentSchemaVersion } from "../globals.js";
import { handleOldEvent } from "./loadOldSchemaEvent.js";
import { handleSchema1Event } from "./loadSchema1Event.js";
import { handleSchema2Event } from "./loadSchema2Event.js";
import { handleSchema3Event } from "./loadSchema3Event.js";
import { handleSchema4Event } from "./loadSchema4Event.js";


export function loadObjects(fileData, eventNum) {
  const eventData = fileData["Event " + eventNum];

  if (typeof eventData === "undefined") {
    return;
  }

  const schemaVersion = determineSchemaVersion(eventData);
  if (typeof schemaVersion === "undefined") {
    return;
  }
  setCurrentSchemaVersion(schemaVersion);
  console.log(`Info: schemaVersion = ${schemaVersion}`);

  if (schemaVersion === 'old') {
    return handleOldEvent(eventData);
  } else if (schemaVersion === 1) {
    return handleSchema1Event(eventData);
  } else if (schemaVersion === 2) {
    return handleSchema2Event(eventData);
  } else if (schemaVersion === 3) {
    return handleSchema3Event(eventData);
  } else if (schemaVersion === 4) {
    return handleSchema4Event(eventData);
  }
}


function determineSchemaVersion(eventData) {
  // Find schema version from the collection properties
  const schemaVersions = Object.values(eventData).map(c => c.collSchemaVersion);
  if (!schemaVersions.every(v => v === undefined)) {
    return Math.max(...schemaVersions.filter(v => v !== undefined));
  }

  // Find schema version from the EDM4hep version
  const edm4hepVersion = String(eventData.edm4hepVersion);
  if (typeof edm4hepVersion !== "undefined") {
    console.log(`Info: EDM4hep version = ${edm4hepVersion}`);
    const schema1versions = ['0.9.0', '0.10.0', '0.10.1', '0.10.2', '0.10.3',
                             '0.10.4', '0.10.5', '0.10.99'];
    const schema2versions = ['0.99.0', '0.99.1'];
    const schema3versions = ['0.99.2'];
    if (schema1versions.includes(edm4hepVersion)) {
      return 1;
    } else if (schema2versions.includes(edm4hepVersion)) {
      return 2;
    } else if (schema3versions.includes(edm4hepVersion)) {
      return 3;
    }

    if (Number(edm4hepVersion.split('.')[1]) < 9) {
      return 'old';
    }
  }

  // TODO: Should return undefined and an erorr that the file in no longer supported.
  console.log('Very old file!');
  return 'old';
}
