export class CheckboxComponent {
  constructor(propertyName, displayedName) {
    this.propertyName = propertyName;
    this.displayedName = displayedName;
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

  checked() {
    return this.checkbox.checked;
  }
}

export function checkboxLogic(checked, object, property) {
  return object[property] === checked;
}

export function bitfieldCheckboxLogic(checked, value, object, property) {
  if (checked) {
    return (parseInt(object[property]) & (1 << parseInt(value))) !== 0;
  }
  return true;
}
