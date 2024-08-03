export class CheckboxComponent {
  constructor(propertyName, displayedName, value) {
    this.propertyName = propertyName;
    this.displayedName = displayedName;
    this.value = value;
  }

  render() {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    this.checkbox = checkbox;
    div.appendChild(checkbox);
    const displayedName = document.createElement("label");
    displayedName.textContent = this.displayedName;
    div.appendChild(displayedName);

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
