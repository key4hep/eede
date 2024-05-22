class FilterParameter {
  constructor(name) {
    this.name = name;
  }

  render(container) {}

  buildCondition() {}
}

export class Range extends FilterParameter {
  constructor(name) {
    super(name);
  }

  render(container) {
    const label = document.createElement("label");
    label.textContent = this.name;
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
        if (particle[this.name] < this.min) {
          return false;
        }

        if (particle[this.name] > this.max) {
          return false;
        }

        return true;
      }
    };
  }
}

export class Checkbox extends FilterParameter {
  constructor(name) {
    super(name);
  }

  render(container) {
    const div = document.createElement("div");
    container.appendChild(div);

    const label = document.createElement("label");
    label.textContent = `Sim Status: ${this.name}`;
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

    return (particle) => particle.simStatus === this.name;
  }
}
