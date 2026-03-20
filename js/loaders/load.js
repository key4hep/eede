import { setCurrentSchemaVersion } from "../globals.js";
import { handleOldEvent } from "./loadOldSchemaEvent.js";
import { handleSchema1Event } from "./loadSchema1Event.js";
import { handleSchema2Event } from "./loadSchema2Event.js";
import { handleSchema3Event } from "./loadSchema3Event.js";

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

  switch (schemaVersion) {
    case "old":
      return handleOldEvent(eventData);
    case 1:
      return handleSchema1Event(eventData);
    case 2:
      return handleSchema2Event(eventData);
    case 3:
    case 6:
      return handleSchema3Event(eventData);
  }
}

function determineSchemaVersion(eventData) {
  // Find schema version from the collection properties
  const schemaVersions = Object.values(eventData).map(
    (c) => c.collSchemaVersion,
  );

  if (!schemaVersions.every((v) => v === undefined)) {
    return Math.max(...schemaVersions.filter((v) => v !== undefined));
  }

  // Find schema version from the EDM4hep version
  const edm4hepVersion = String(eventData.edm4hepVersion);

  console.log(`Info: EDM4hep version = ${edm4hepVersion}`);

  if (!edm4hepVersion) return undefined;

  switch (edm4hepVersion) {
    case "0.9.0":
    case "0.10.0":
    case "0.10.1":
    case "0.10.2":
    case "0.10.3":
    case "0.10.4":
    case "0.10.5":
    case "0.10.99":
      return 1;
    case "0.99.0":
    case "0.99.1":
      return 2;
    case "0.99.2":
      return 3;
    case "1.0.0":
      return 6;
    default: {
      const version = edm4hepVersion.split(".");

      return Number(version[0]) === 0 && Number(version[1]) < 9
        ? "old"
        : undefined;
    }
  }
}
