export function restoreRelations(objects) {
  for (const { collection } of Object.values(objects.datatypes)) {
    for (const object of collection) {
      object.restoreRelations();
    }
  }
}
