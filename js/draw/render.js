export async function renderObjects(objects) {
  const datatypes = objects.datatypes;
  const associations = objects.associations;

  for (const { collection } of Object.values(datatypes)) {
    for (const object of collection) {
      object.renderedBox = null;
      await object.draw();
    }
  }

  for (const { oneToMany, oneToOne } of Object.values(datatypes)) {
    for (const links of Object.values(oneToMany)) {
      for (const link of links) {
        link.draw();
      }
    }

    for (const links of Object.values(oneToOne)) {
      for (const link of links) {
        link.draw();
      }
    }
  }

  for (const collection of Object.values(associations)) {
    for (const association of collection) {
      association.draw();
    }
  }
}
