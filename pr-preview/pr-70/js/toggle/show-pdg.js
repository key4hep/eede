import { removeImageFromBox } from "../draw/box.js";

const toggleImage = (object, newText) => {
  object.textToRender = newText;
  const renderedBox = object.renderedBox;
  removeImageFromBox(object.image, renderedBox);
  if (renderedBox.renderable) {
    object.drawImage(object.textToRender, object.imageY);
  }
};

export const togglePDG = (objects) => {
  const collection = objects.datatypes["edm4hep::MCParticle"].collection;

  collection.map((object) => {
    toggleImage(object, object.name);
  });
};

export const toggleId = (objects) => {
  const collection = objects.datatypes["edm4hep::MCParticle"].collection;

  collection.map((object) => {
    toggleImage(object, object.PDG);
  });
};
