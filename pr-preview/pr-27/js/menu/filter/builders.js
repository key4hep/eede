import { Checkbox } from "./parameters.js";

export class CheckboxBuilder {
  constructor(name, fullName) {
    this.uniqueValues = new Set();
    this.checkBoxes = [];
    this.name = name;
    this.fullName = fullName;
  }

  add(val) {
    this.uniqueValues.add(val);
  }

  setCheckBoxes() {
    this.checkBoxes = Array.from(this.uniqueValues).map(
      (option) => new Checkbox(this.name, option)
    );
    this.checkBoxes.sort((a, b) => a.value - b.value);
  }

  render(container) {
    const section = document.createElement("div");
    this.checkBoxes.forEach((checkbox) => (checkbox.checked = false));
    const title = document.createElement("p");
    title.textContent = this.fullName;
    section.appendChild(title);
    const options = document.createElement("div");
    options.style.display = "flex";
    options.style.flexDirection = "row";
    options.style.flexWrap = "wrap";
    section.appendChild(options);
    container.appendChild(section);
    this.checkBoxes.forEach((checkbox) => checkbox.render(options));
  }
}
