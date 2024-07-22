import { CheckboxBuilder, BitFieldBuilder } from "./builders.js";
import { Range, Checkbox, buildCriteriaFunction } from "./parameters.js";
import { reconnect } from "./reconnect.js";
import { units } from "../../types/units.js";
import { copyObject } from "../../lib/copy.js";
import { SimStatusBitFieldDisplayValues } from "../../../mappings/sim-status.js";
import { renderObjects } from "../../draw/render.js";

const filterButton = document.getElementById("filter-button");
const openFilter = document.getElementById("open-filter");
const closeFilter = document.getElementById("close-filter");
const filterContent = document.getElementById("filter-content");
const filters = document.getElementById("filters");
const apply = document.getElementById("filter-apply");
const reset = document.getElementById("filter-reset");

let active = false;

export function renderRangeParameters(rangeParameters) {
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
  filters.appendChild(rangeFilters);
}

export function getWidthFilterContent() {
  const filterContent = document.getElementById("filter-content");
  filterContent.style.display = "flex";
  const rangeFilters = document.getElementById("range-filters");
  const width = rangeFilters.offsetWidth;
  filterContent.style.display = "none";
  return `${width}px`;
}

export function renderGenSim(sim, gen) {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.width = "fit-content";
  div.style.alignItems = "start";
  sim.render(div);
  gen.render(div);
  filters.appendChild(div);
}

let parametersRange = units.sort((a, b) =>
  a.property.localeCompare(b.property)
);

parametersRange = parametersRange.map((parameter) => new Range(parameter));

const bits = new BitFieldBuilder(
  "simulatorStatus",
  "Simulation status",
  SimStatusBitFieldDisplayValues
);
bits.setCheckBoxes();

const genStatus = new CheckboxBuilder("generatorStatus", "Generator status");

function applyFilter(loadedObjects, currentObjects) {
  const rangeFunctions = Range.buildFilter(parametersRange);
  const checkboxFunctions = Checkbox.buildFilter(bits.checkBoxes);
  const genStatusFunctions = Checkbox.buildFilter(genStatus.checkBoxes);

  const criteriaFunction = buildCriteriaFunction(
    rangeFunctions,
    checkboxFunctions,
    genStatusFunctions
  );

  const filteredObjects = reconnect(criteriaFunction, loadedObjects);

  copyObject(filteredObjects, currentObjects);
  renderObjects(currentObjects);
}

function removeFilter(loadedObjects, currentObjects) {
  copyObject(loadedObjects, currentObjects);
  renderObjects(currentObjects);

  filters.innerHTML = "";

  renderRangeParameters(parametersRange);
  renderGenSim(bits, genStatus);
}

export function start(loadedObjects, currentObjects) {
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

  apply.addEventListener("click", () =>
    applyFilter(loadedObjects, currentObjects)
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && active) {
      applyFilter(loadedObjects, currentObjects);
    }
  });

  reset.addEventListener("click", () =>
    removeFilter(loadedObjects, currentObjects)
  );
}

export { bits, genStatus, parametersRange };
