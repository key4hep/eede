import { drawAll } from "../../draw.js";
import {
  ctx,
  particlesHandler,
  currentParticles,
  visibleParticles,
} from "../../main.js";
import { CheckboxBuilder } from "./builders.js";
import { Range, Checkbox, buildCriteriaFunction } from "./parameters.js";
import { reconnect } from "./reconnect.js";
import { getVisible } from "../../events.js";

const filterButton = document.getElementById("filter-button");
const openFilter = document.getElementById("open-filter");
const closeFilter = document.getElementById("close-filter");
const filterContent = document.getElementById("filter-content");
const filters = document.getElementById("filters");
const apply = document.getElementById("filter-apply");
const reset = document.getElementById("filter-reset");

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

export function getWidthFilterContent() {
  const filterContent = document.getElementById("filter-content");
  filterContent.style.display = "flex";
  const rangeFilters = document.getElementById("range-filters");
  const width = rangeFilters.offsetWidth;
  filterContent.style.display = "none";
  return `${width}px`;
}

export function renderGenSim(sim, gen, container) {
  const div = document.createElement("div");
  div.style.display = "grid";
  div.style.width = "fit-content";
  div.style.columnGap = "10px";
  div.style.rowGap = "5px";
  div.style.alignItems = "start";
  div.style.gridTemplateColumns = "fit-content(100%) fit-content(100%)";
  sim.render(div);
  gen.render(div);
  container.appendChild(div);
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

const bits = new CheckboxBuilder("simStatus", "Simulator status");
const genStatus = new CheckboxBuilder("genStatus", "Generator status");

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
  renderGenSim(bits, genStatus, filters);
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
