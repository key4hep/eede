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

export class Range extends FilterParameter {
  min;
  max;

  constructor(property) {
    super(property);
  }

  render(container) {
    const label = document.createElement("label");
    label.textContent = this.property;
    container.appendChild(label);

    const inputMin = document.createElement("input");
    inputMin.type = "number";
    inputMin.placeholder = "min";
    container.appendChild(inputMin);

    const separator = document.createTextNode(" - ");
    container.appendChild(separator);

    const inputMax = document.createElement("input");
    inputMax.type = "number";
    inputMax.placeholder = "max";
    container.appendChild(inputMax);

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
