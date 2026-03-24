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

  if (!schemaVersions.every((v) => v === undefined)) {
    return Math.max(...schemaVersions.filter((v) => v !== undefined));
  }

  // Find schema version from the EDM4hep version
  const edm4hepVersion = eventData.edm4hepVersion;

  if (edm4hepVersion === undefined) return "old";

  console.log(`Info: EDM4hep version = ${edm4hepVersion}`);

  const schema1 = ["0.9.", "0.10."];
  const schema2 = ["0.99.0", "0.99.1"];
  const schema3 = ["0.99.2"];
  const schema4 = ["0.99.99"]; // From nightly
  const schema6 = ["1.0."];

  if (schema1.some((v) => edm4hepVersion.startsWith(v))) return 1;
  if (schema2.some((v) => edm4hepVersion.startsWith(v))) return 2;
  if (schema3.some((v) => edm4hepVersion.startsWith(v))) return 3;
  if (schema4.some((v) => edm4hepVersion.startsWith(v))) return 4;
  if (schema6.some((v) => edm4hepVersion.startsWith(v))) return 6;

  return "old";
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
    case "old":
      return handleOldEvent(eventData);
    case 1:
      return handleSchema1Event(eventData);
    case 2:
      return handleSchema2Event(eventData);
    case 3:
      return handleSchema3Event(eventData);
    case 4:
    case 6:
      return handleSchema4Event(eventData);
  }
}
