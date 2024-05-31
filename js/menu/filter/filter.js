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

let bits = {
  simStatuses: new Set(),
  add: (simStatus) => bits.simStatuses.add(simStatus),
  checkBoxes: [],
  toCheckBox: () =>
    Array.from(bits.simStatuses).map((bit) => new Checkbox("simStatus", bit)),
  setCheckBoxes: () => (bits.checkBoxes = bits.toCheckBox()),
  render: () => bits.checkBoxes.forEach((checkbox) => checkbox.render(filters)),
};

apply.addEventListener("click", () => {
  const rangeFunctions = Range.buildFilter(parametersRange);
  const checkboxFunctions = Checkbox.buildFilter(bits.checkBoxes);

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

  bits.checkBoxes.forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.render(filters);
  });
});

export { bits };
