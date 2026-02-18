/*
 * Datatypes
 */
import { supportedEDM4hepTypes } from "./datatypes.js";

export function getSupportedEDM4hepTypes(schemaVersion) {
  if (typeof schemaVersion === "undefined") {
    return supportedEDM4hepTypes[getCurrentSchemaVersion()];
  }

  return supportedEDM4hepTypes[schemaVersion];
}

export function setCurrentSchemaVersion(schemaVersion) {
  window.sessionStorage.setItem("current-schema-version", schemaVersion);
}

export function getCurrentSchemaVersion() {
  return window.sessionStorage.getItem("current-schema-version");
}
