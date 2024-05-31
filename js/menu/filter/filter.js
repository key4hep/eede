import { drawAll } from "../../draw.js";
import { parentLinks, childrenLinks, infoBoxes, ctx } from "../../main.js";
import { Range, Checkbox, buildCriteriaFunction } from "./parameters.js";
import { reconnect } from "./reconnect.js";

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

let parametersRange = ["momentum", "vertex", "time", "mass", "charge"];

parametersRange = parametersRange.map((parameter) => new Range(parameter));

parametersRange.forEach((parameter) => parameter.render(filters));

let bitsCheckbox = [23, 24, 25, 26, 27, 28, 29, 30];

bitsCheckbox = bitsCheckbox.map((bit) => new Checkbox("simStatus", bit));

bitsCheckbox.forEach((checkbox) => checkbox.render(filters));

apply.addEventListener("click", () => {
  const rangeFunctions = Range.buildFilter(parametersRange);
  const checkboxFunctions = Checkbox.buildFilter(bitsCheckbox);

  const criteriaFunction = buildCriteriaFunction(
    rangeFunctions,
    checkboxFunctions
  );

  const [newParentLinks, newChildrenLinks, filteredParticles] = reconnect(
    criteriaFunction,
    parentLinks,
    childrenLinks,
    infoBoxes
  );

  drawAll(ctx, newParentLinks, newChildrenLinks, filteredParticles);
});

reset.addEventListener("click", () => {
  drawAll(ctx, parentLinks, childrenLinks, infoBoxes);

  filters.innerHTML = "";

  parametersRange.forEach((parameter) => {
    parameter.min = undefined;
    parameter.max = undefined;
    parameter.render(filters);
  });

  bitsCheckbox.forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.render(filters);
  });
});
