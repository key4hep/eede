export function setCurrentSchemaVersion(schemaVersion) {
  window.sessionStorage.setItem("current-schema-version", schemaVersion);
}

export function getCurrentSchemaVersion() {
  return window.sessionStorage.getItem("current-schema-version");
}
