import { pixi } from "./app.js";

export async function renderObjects(objects) {
  const datatypes = objects.datatypes;
  const associations = objects.associations;

  const { app } = pixi;

  for (const collection of Object.values(associations)) {
    for (const association of collection) {
      association.draw(app);
    }
  }

  for (const elements of Object.values(datatypes)) {
    const { collection, oneToMany, oneToOne } = elements;

    for (const links of Object.values(oneToMany)) {
      for (const link of links) {
        link.draw(app);
      }
    }

    for (const links of Object.values(oneToOne)) {
      for (const link of links) {
        link.draw(app);
      }
    }

    for (const object of collection) {
      object.draw(app);
    }
  }
}
