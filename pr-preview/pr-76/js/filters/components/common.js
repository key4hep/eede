import {
  CheckboxComponent,
  checkboxLogic,
  objectSatisfiesCheckbox,
} from "./checkbox.js";
import {
  createButtonForCheckboxes,
  createCheckboxContainer,
  createCollectionSubtitle,
  createSubContainer,
} from "./lib.js";

export function buildCollectionCheckboxes(collection) {
  const container = createSubContainer();
  const div = document.createElement("div");
  div.classList.add("collection-checkboxes-handler");
  const title = createCollectionSubtitle("Collection");
  const buttonsDiv = document.createElement("div");
  const selectAll = createButtonForCheckboxes("Select all");
  const clearAll = createButtonForCheckboxes("Clear all");
  div.appendChild(title);
  buttonsDiv.appendChild(selectAll);
  buttonsDiv.appendChild(clearAll);
  div.appendChild(buttonsDiv);
  container.appendChild(div);
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
    checkbox.checked(true);
  });
  container.appendChild(checkboxesContainer);

  selectAll.addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked(true);
    });
  });

  clearAll.addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked(false);
    });
  });

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
