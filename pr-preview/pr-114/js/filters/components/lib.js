import { CheckboxComponent } from "./checkbox.js";

export function addCollectionTitle(name) {
  const title = document.createElement("span");
  title.textContent = name;
  title.classList.add("filter-collection-title");
  return title;
}

export function collectionFilterContainer() {
  const container = document.createElement("div");
  container.classList.add("filter-collection-container");
  return container;
}

export function createCollectionSubtitle(name) {
  const title = document.createElement("span");
  title.textContent = name;
  title.classList.add("filter-collection-subtitle");
  return title;
}

export function createSubContainer() {
  const container = document.createElement("div");
  container.classList.add("filter-sub-container");
  return container;
}

export function createCheckboxContainer() {
  const container = document.createElement("div");
  container.classList.add("filter-checkbox-container");
  return container;
}

export function createButtonForCheckboxes(text) {
  const button = document.createElement("button");
  button.classList.add("checkbox-button");
  button.innerText = text;
  return button;
}

export function buildEnumCheckboxGroup(label, propertyName, values) {
  const groupContainer = createSubContainer();
  groupContainer.appendChild(createCollectionSubtitle(label));
  const checkboxesContainer = createCheckboxContainer();

  const checkboxes = [...values].map((value) => {
    const checkbox = new CheckboxComponent(propertyName, value, value, true);
    checkboxesContainer.appendChild(checkbox.render());
    checkbox.checked(true);
    return checkbox;
  });

  groupContainer.appendChild(checkboxesContainer);
  return { groupContainer, checkboxes };
}

export function buildCheckboxes(collection) {
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
      true,
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
