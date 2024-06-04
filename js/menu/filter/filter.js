import { drawAll } from "../../draw.js";
import {
  ctx,
  particlesHandler,
  currentParticles,
  visibleParticles,
} from "../../main.js";
import { Range, Checkbox, buildCriteriaFunction } from "./parameters.js";
import { reconnect } from "./reconnect.js";
import { getVisible } from "../../events.js";

const filterButton = document.getElementById("filter-button");
const openFilter = document.getElementById("open-filter");
const closeFilter = document.getElementById("close-filter");
const filterContent = document.getElementById("filter-content");

let active = false;

filterButton.addEventListener("click", () => {
  active = !active;

  if (active) {
    openFilter.style.display = "none";
    closeFilter.style.display = "block";
    filterContent.style.display = "flex";
  } else {
    openFilter.style.display = "block";
    closeFilter.style.display = "none";
    filterContent.style.display = "none";
  }
});

const filters = document.getElementById("filters");
const apply = document.getElementById("filter-apply");
const reset = document.getElementById("filter-reset");

let parametersRange = [
  {
    property: "momentum",
    unit: "GeV",
  },
  {
    property: "mass",
    unit: "GeV",
  },
  {
    property: "charge",
    unit: "e",
  },
  {
    property: "vertex",
    unit: "mm",
  },
  {
    property: "time",
    unit: "ns",
  },
];

parametersRange = parametersRange.sort((a, b) =>
  a.property.localeCompare(b.property)
);

parametersRange = parametersRange.map((parameter) => new Range(parameter));

parametersRange.forEach((parameter) => parameter.render(filters));

class CheckboxBuilder {
  constructor(name) {
    this.uniqueValues = new Set();
    this.checkBoxes = [];
    this.name = name;
  }

  add(val) {
    this.uniqueValues.add(val);
  }

  setCheckBoxes() {
    this.checkBoxes = Array.from(this.uniqueValues).map(
      (option) => new Checkbox(this.name, option)
    );
  }

  render() {
    if (this.checkBoxes.length !== 0)
      this.checkBoxes.forEach((checkbox) => (checkbox.checked = false));
    filters.innerHTML += `<p>${this.name}</p>`;
    const options = document.createElement("div");
    options.style.display = "flex";
    options.style.flexDirection = "row";
    options.style.flexWrap = "wrap";
    filters.appendChild(options);
    this.checkBoxes.forEach((checkbox) => checkbox.render(options));
  }
}

const bits = new CheckboxBuilder("simStatus");
const genStatus = new CheckboxBuilder("genStatus");

function applyFilter(particlesHandler, currentParticles, visibleParticles) {
  const rangeFunctions = Range.buildFilter(parametersRange);
  const checkboxFunctions = Checkbox.buildFilter(bits.checkBoxes);
  const genStatusFunctions = Checkbox.buildFilter(genStatus.checkBoxes);

  const criteriaFunction = buildCriteriaFunction(
    rangeFunctions,
    checkboxFunctions,
    genStatusFunctions
  );

  const [newParentLinks, newChildrenLinks, filteredParticles] = reconnect(
    criteriaFunction,
    particlesHandler
  );

  currentParticles.parentLinks = newParentLinks;
  currentParticles.childrenLinks = newChildrenLinks;
  currentParticles.infoBoxes = filteredParticles;

  drawAll(ctx, currentParticles);

  getVisible(currentParticles, visibleParticles);
}

function removeFilter(particlesHandler, currentParticles, visibleParticles) {
  currentParticles.parentLinks = particlesHandler.parentLinks;
  currentParticles.childrenLinks = particlesHandler.childrenLinks;
  currentParticles.infoBoxes = particlesHandler.infoBoxes;

  drawAll(ctx, currentParticles);

  getVisible(currentParticles, visibleParticles);

  filters.innerHTML = "";

  parametersRange.forEach((parameter) => {
    parameter.min = undefined;
    parameter.max = undefined;
    parameter.render(filters);
  });

  bits.render();
  genStatus.render();
}

apply.addEventListener("click", () =>
  applyFilter(particlesHandler, currentParticles, visibleParticles)
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && active) {
    applyFilter(particlesHandler, currentParticles, visibleParticles);
  }
});

reset.addEventListener("click", () =>
  removeFilter(particlesHandler, currentParticles, visibleParticles)
);

export { bits, genStatus };
