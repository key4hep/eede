import { getApp, createContainer } from "./app.js";

export async function renderObjects(objects) {
  const app = getApp();
  app.stage.removeChildren();
  createContainer(app, objects);

  const datatypes = objects.datatypes;
  const associations = objects.associations;

  for (const { collection } of Object.values(datatypes)) {
    const renderPromises = collection.map((object) => object.draw());
    await Promise.all(renderPromises);
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
