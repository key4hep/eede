const createCheckboxContainer = () => {
  const container = document.createElement("div");
  container.classList.add("checkbox-title-container");
  return container;
};

const createCheckbox = () => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("filter-checkbox");
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

  getValues() {
    return {
      checked: this.checkbox.checked,
      value: this.value,
    };
  }
}

export function checkboxLogic(checked, value, object, property) {
  if (checked) {
    return object[property] === value;
  }
  return true;
}

export function bitfieldCheckboxLogic(checked, value, object, property) {
  if (checked) {
    return (parseInt(object[property]) & (1 << parseInt(value))) !== 0;
  }
  return true;
}
