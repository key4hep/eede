import { removeParticleNameFromBox } from "../draw/box.js";

const toggleText = (object, newText) => {
  object.textToRender = newText;
  const renderedBox = object.renderedBox;
  removeParticleNameFromBox(object.image, renderedBox);
  if (renderedBox.renderable) {
    object.renderText(object.textToRender, object.imageY);
  }
};

export const togglePDG = (objects) => {
  const collection = objects.datatypes["edm4hep::MCParticle"].collection;

  collection.map((object) => {
    toggleText(object, object.name);
  });
};

export const toggleId = (objects) => {
  const collection = objects.datatypes["edm4hep::MCParticle"].collection;

  collection.map((object) => {
    toggleText(object, object.PDG);
  });
};
