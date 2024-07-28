class FilterParameter {
  property;

  constructor(property) {
    this.property = property;
  }

  render(container) {}

  buildCondition() {}

  static parametersFunctions(parameters) {
    const functions = parameters.map((parameter) => parameter.buildCondition());
    return functions.filter((fn) => fn);
  }
}

function createNumberInput(placeholder) {
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = placeholder;
  input.style.width = "35px";

  return input;
}

export class Range extends FilterParameter {
  min;
  max;

  constructor({ property, unit }) {
    super(property);
    this.unit = unit;
  }

  render(container) {
    const label = document.createElement("label");
    label.textContent = `${this.property}`;

    const inputMin = createNumberInput("min");
    inputMin.addEventListener("input", (e) => {
      this.min = e.target.value;
    });

    const separator = document.createTextNode("-");

    const inputMax = createNumberInput("max");
    inputMax.addEventListener("input", (e) => {
      this.max = e.target.value;
    });

    const unitElement = document.createTextNode(`${this.unit}`);

    const content = document.createElement("div");
    content.appendChild(inputMin);
    content.appendChild(separator);
    content.appendChild(inputMax);
    content.appendChild(unitElement);
    content.style.display = "grid";
    content.style.gridAutoFlow = "column";
    content.style.columnGap = "5px";
    content.style.display = "flex";
    content.style.flexDirection = "row";
    content.style.justifyContent = "flex-start";

    container.appendChild(label);
    container.appendChild(content);
  }

  buildCondition() {
    if (!this.min && !this.max) return null;

    return (particle) => {
      if (particle) {
        if (particle[this.property] < this.min) {
          return false;
        }

        if (particle[this.property] > this.max) {
          return false;
        }

        return true;
      }
    };
  }

  static buildFilter(parametersRange) {
    const rangeFunctions = Range.parametersFunctions(parametersRange);

    const func = rangeFunctions.reduce(
      (acc, fn) => {
        return (particle) => acc(particle) && fn(particle);
      },
      () => true
    );

    return func;
  }
}

export class Checkbox extends FilterParameter {
  value;

  constructor(property, value, displayValue = null) {
    super(property);
    this.value = value;
    if (displayValue) {
      this.displayValue = displayValue;
    } else {
      this.displayValue = value;
    }
  }

  render(container) {
    const div = document.createElement("div");
    container.appendChild(div);

    const label = document.createElement("label");
    label.textContent = this.displayValue;
    div.appendChild(label);

    const input = document.createElement("input");
    input.type = "checkbox";
    div.appendChild(input);

    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.alignItems = "center";
    div.style.backgroundColor = "#dddddd";
    div.style.borderRadius = "5px";
    div.style.margin = "3px";

    input.addEventListener("change", () => {
      this.checked = input.checked;
    });
  }

  buildCondition() {
    if (!this.checked) return null;

    return (particle) => particle[this.property] === this.value;
  }

  static buildFilter(parametersCheckbox) {
    const checkboxFunctions = Checkbox.parametersFunctions(parametersCheckbox);

    if (checkboxFunctions.length === 0) return () => true;

    const func = checkboxFunctions.reduce(
      (acc, fn) => {
        return (particle) => acc(particle) || fn(particle);
      },
      () => false
    );

    return func;
  }
}

export class ValueCheckBox extends Checkbox {
  // Classic checkbox
  constructor(property, value, displayValue) {
    super(property, value, displayValue);
  }
}

export class BitfieldCheckbox extends Checkbox {
  // Bit manipulation EDM4hep
  constructor(property, value, displayValue) {
    super(property, value, displayValue);
  }

  buildCondition() {
    if (!this.checked) return null;

    return (particle) =>
      (parseInt(particle[this.property]) & (1 << parseInt(this.value))) !== 0;
  }

  render(container) {
    const div = document.createElement("div");
    container.appendChild(div);

    const input = document.createElement("input");
    input.type = "checkbox";
    div.appendChild(input);

    const label = document.createElement("label");
    label.textContent = this.displayValue;
    div.appendChild(label);

    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.alignItems = "center";
    div.style.backgroundColor = "#dddddd";
    div.style.borderRadius = "5px";
    div.style.margin = "3px";

    input.addEventListener("change", () => {
      this.checked = input.checked;
    });
  }

  static getDisplayValue(dictionary, option) {
    return dictionary[option] ?? option;
  }
}

export function buildCriteriaFunction(...functions) {
  const filterFunctions = functions.filter((fn) => typeof fn === "function");

  const finalFunction = filterFunctions.reduce(
    (acc, fn) => {
      return (particle) => acc(particle) && fn(particle);
    },
    () => true
  );

  return (particle) => finalFunction(particle);
}
