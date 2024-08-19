const createCheckboxContainer = () => {
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
    const div = createCheckboxContainer();
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

export function checkboxLogic(value, object, property) {
  return object[property] === value;
}

export function bitfieldCheckboxLogic(value, object, property) {
  return (parseInt(object[property]) & (1 << parseInt(value))) !== 0;
}

export function objectSatisfiesCheckbox(
  object,
  checkboxes,
  property,
  logicFunction
) {
  for (const checkbox of checkboxes) {
    const { checked, value } = checkbox.getValues();

    if (checked && logicFunction(value, object, property)) {
      return true;
    }
  }

  return false;
}
