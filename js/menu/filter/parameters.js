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

function createNumberInput(container, placeholder) {
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = placeholder;
  input.style.width = "50px";

  container.appendChild(input);
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
    const title = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = `${this.property} (${this.unit})`;
    title.appendChild(label);

    const content = document.createElement("div");
    const inputMin = createNumberInput(container, "min");
    const separator = document.createTextNode(" - ");
    const inputMax = createNumberInput(container, "max");
    content.appendChild(inputMin);
    content.appendChild(separator);
    content.appendChild(inputMax);
    content.style.display = "flex";
    content.style.flexDirection = "row";
    content.style.justifyContent = "space-around";

    container.appendChild(title);
    container.appendChild(content);

    inputMin.addEventListener("input", () => {
      this.min = inputMin.value;
    });

    inputMax.addEventListener("input", () => {
      this.max = inputMax.value;
    });
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

  constructor(property, value) {
    super(property);
    this.value = value;
  }

  render(container) {
    const div = document.createElement("div");
    container.appendChild(div);

    const label = document.createElement("label");
    label.textContent = `${this.property}: ${this.value}`;
    div.appendChild(label);

    const input = document.createElement("input");
    input.type = "checkbox";
    div.appendChild(input);

    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "space-between";

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
