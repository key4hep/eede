const createInput = (placeholder) => {
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = placeholder;
  input.classList.add("range-input");
  input.classList.add("filter-input-range");

  return input;
};

const createUnitElement = (unit) => {
  const unitElement = document.createElement("span");
  unitElement.textContent = unit;
  unitElement.classList.add("range-unit");

  return unitElement;
};

export class RangeComponent {
  constructor(propertyName, displayedName, unit) {
    this.propertyName = propertyName;
    this.displayedName = displayedName;
    this.unit = unit;
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("range-filter");
    const displayedName = document.createElement("label");
    displayedName.textContent = this.displayedName;
    div.appendChild(displayedName);

    const range = document.createElement("div");
    range.classList.add("range-inputs");

    const min = createInput("min");
    this.min = min;
    range.appendChild(min);
    range.appendChild(document.createTextNode("-"));
    const max = createInput("max");
    this.max = max;
    range.appendChild(max);

    div.appendChild(range);

    const unit = createUnitElement(this.unit);
    div.appendChild(unit);

    return div;
  }

  getValues() {
    return {
      min: this.min.value,
      max: this.max.value,
    };
  }
}
