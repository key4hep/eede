export class RangeComponent {
  constructor(propertyName, displayedName, unit) {
    this.propertyName = propertyName;
    this.displayedName = displayedName;
    this.unit = unit;
  }

  render() {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    const displayedName = document.createElement("label");
    displayedName.textContent = this.displayedName;
    div.appendChild(displayedName);
    const range = document.createElement("div");
    const min = document.createElement("input");
    this.min = min;
    min.type = "number";
    min.placeholder = "min";
    range.appendChild(min);

    range.appendChild(document.createTextNode("-"));

    const max = document.createElement("input");
    this.max = max;
    max.type = "number";
    max.placeholder = "max";
    range.appendChild(max);
    div.appendChild(range);

    const unit = document.createElement("label");
    unit.textContent = this.unit;
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

export function rangeLogic(min, max, object, property) {
  const minVal = parseFloat(min);
  const maxVal = parseFloat(max);

  if (minVal && maxVal) {
    return object[property] >= minVal && object[property] <= maxVal;
  } else if (minVal) {
    return object[property] >= minVal;
  } else if (maxVal) {
    return object[property] <= maxVal;
  }
  return true;
}

export function magnitudeRangeLogic(min, max, object, property) {
  const minVal = parseFloat(min);
  const maxVal = parseFloat(max);

  const objectMagnitude = Math.sqrt(
    Object.values(object[property]).reduce((acc, val) => acc + val ** 2, 0)
  );

  if (minVal && maxVal) {
    return objectMagnitude >= minVal && objectMagnitude <= maxVal;
  } else if (minVal) {
    return objectMagnitude >= minVal;
  } else if (maxVal) {
    return objectMagnitude <= maxVal;
  }
  return true;
}
