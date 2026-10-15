import { setCurrentSchemaVersion } from "../state/globals.js";
import { handleOldEvent } from "./schemas/loadOldSchemaEvent.js";
import { handleSchema1Event } from "./schemas/loadSchema1Event.js";
import { handleSchema2Event } from "./schemas/loadSchema2Event.js";
import { handleSchema3Event } from "./schemas/loadSchema3Event.js";
import { handleSchema4Event } from "./schemas/loadSchema4Event.js";

function determineSchemaVersion(eventData) {
  // Find schema version from the collection properties
  const schemaVersions = Object.values(eventData).map(
    (c) => c.collSchemaVersion,
  );

  // Return the highest one
  if (!schemaVersions.every((v) => v === undefined)) {
    return Math.max(...schemaVersions.filter((v) => v !== undefined));
  }

  // If there is none, approximate schema version from EDM4hep
  const edm4hepVersion = eventData.edm4hepVersion;

  if (edm4hepVersion === undefined) return 0;

  console.log(`Info: EDM4hep version = ${edm4hepVersion}`);

  const [major = 0, minor = 0, patch = 0] = edm4hepVersion
    .split(".")
    .map((n) => parseInt(n, 10) || 0);

  if (major === 0) {
    if (minor < 99) return 1; // Schema 1 < 0.99.0
    if (patch < 2) return 2; // Schema 2 < 0.99.2
    if (patch === 2) return 3; // Schema 3 === 0.99.2
  }

  return 4; // Schema 4 > 0.99.2
}

export function formatEventData(fileData, eventNum) {
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
    case 0: // fallback for undefined schemas
      return handleOldEvent(eventData);
    case 1:
      return handleSchema1Event(eventData);
    case 2:
      return handleSchema2Event(eventData);
    case 3:
      return handleSchema3Event(eventData);
    case 4: // fallback for future schemas
    default:
      return handleSchema4Event(eventData);
  }
}
