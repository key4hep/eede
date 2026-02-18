import { getCurrentSchemaVersion } from "../state/schema.js";

export function schemaWithLinks() {
  const currentSchemaVersion = getCurrentSchemaVersion();

  if (typeof currentSchemaVersion === "undefined") {
    return false;
  }

  if (currentSchemaVersion === "old") {
    return false;
  }
  if (currentSchemaVersion == 1) {
    return false;
  }

  return true;
}
