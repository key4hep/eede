import { createSubContainer, createCollectionSubtitle } from "./lib.js";

const createCheckboxItemContainer = () => {
  const container = document.createElement("div");
  container.classList.add("checkbox-title-container");
  return container;
};

const createCheckbox = () => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("filter-checkbox");
  checkbox.classList.add("filter-input-checkbox");

  return checkbox;
};

export class CheckboxComponent {
  constructor(propertyName, displayedName, value, firstCheckbox = true) {
    this.propertyName = propertyName;
    this.displayedName = displayedName;
    this.value = value;
    this.firstCheckbox = firstCheckbox;
  }

  render() {
    const div = createCheckboxItemContainer();
    const checkbox = createCheckbox();
    this.checkbox = checkbox;
    const displayedName = document.createElement("label");
    displayedName.textContent = this.displayedName;

    if (this.firstCheckbox) {
      div.appendChild(checkbox);
      div.appendChild(displayedName);
    } else {
      div.appendChild(displayedName);
      div.appendChild(checkbox);
    }

    return div;
  }

  checked(value) {
    this.checkbox.checked = value;
  }

  getValues() {
    return {
      checked: this.checkbox.checked,
      value: this.value,
    };
  }
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

export function buildEnumCheckboxes(label, propertyName, values) {
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

export function buildBitfieldCheckboxes(collection) {
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
