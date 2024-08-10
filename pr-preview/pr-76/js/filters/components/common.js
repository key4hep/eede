import {
  CheckboxComponent,
  checkboxLogic,
  objectSatisfiesCheckbox,
} from "./checkbox.js";
import {
  createCheckboxContainer,
  createCollectionSubtitle,
  createSubContainer,
} from "./lib.js";

export function buildCollectionCheckboxes(collection) {
  const container = createSubContainer();
  const title = createCollectionSubtitle("Collection");
  container.appendChild(title);
  const checkboxesContainer = createCheckboxContainer();

  const checkboxes = [];
  const collections = new Set();
  collection.forEach((object) => collections.add(object.collectionName));

  collections.forEach((collectionName) => {
    const checkbox = new CheckboxComponent(
      "collectionName",
      collectionName,
      collectionName,
      true
    );
    checkboxes.push(checkbox);
    checkboxesContainer.appendChild(checkbox.render());
  });
  container.appendChild(checkboxesContainer);

  return [container, checkboxes];
}

export function filterOutByNormalCheckboxes(object, checkboxGroup) {
  let satisfies = true;

  Object.values(checkboxGroup).forEach((checkboxes) => {
    const res = objectSatisfiesCheckbox(
      object,
      checkboxes,
      checkboxes[0].propertyName,
      checkboxLogic
    );
    satisfies = satisfies && res;
  });

  return satisfies;
}
