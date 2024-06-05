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
const filters = document.getElementById("filters");
const filter = document.getElementById("filter");
const apply = document.getElementById("filter-apply");
const reset = document.getElementById("filter-reset");

let active = false;

filterButton.addEventListener("click", () => {
  active = !active;

  if (active) {
    openFilter.style.display = "none";
    closeFilter.style.display = "block";
    filterContent.style.display = "flex";
    const rangeFiltersWidth =
      document.getElementById("range-filters").offsetWidth;
    filter.style.width = `${rangeFiltersWidth}px`;
  } else {
    openFilter.style.display = "block";
    closeFilter.style.display = "none";
    filterContent.style.display = "none";
  }
});

export function renderRangeParameters(container, rangeParameters) {
  const rangeFilters = document.createElement("div");
  rangeFilters.id = "range-filters";
  rangeFilters.style.display = "grid";
  rangeFilters.style.width = "fit-content";
  rangeFilters.style.columnGap = "10px";
  rangeFilters.style.rowGap = "5px";
  rangeFilters.style.alignItems = "center";
  rangeFilters.style.gridTemplateColumns =
    "fit-content(100%) fit-content(100%)";
  rangeParameters.forEach((parameter) => {
    parameter.min = undefined;
    parameter.max = undefined;
    parameter.render(rangeFilters);
  });
  container.appendChild(rangeFilters);
}

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

  render(container) {
    this.checkBoxes.forEach((checkbox) => (checkbox.checked = false));
    const title = document.createElement("p");
    title.textContent = this.name;
    container.appendChild(title);
    const options = document.createElement("div");
    options.style.display = "flex";
    options.style.flexDirection = "row";
    options.style.flexWrap = "wrap";
    container.appendChild(options);
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

  renderRangeParameters(filters, parametersRange);
  bits.render(filters);
  genStatus.render(filters);
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

export { bits, genStatus, parametersRange };
