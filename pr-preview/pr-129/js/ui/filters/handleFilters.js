import { filterDefinitions } from "./defineFilters.js";
import { buildFilters } from "./buildFilters.js";

const filtersContent = document.getElementById("filters-content");
const resetButton = document.getElementById("filter-reset");
const invertFilter = document.getElementById("invert-filter");
const openFiltersButton = document.getElementById("open-filter");
const closeFiltersButton = document.getElementById("close-filter");
const filtersBody = document.getElementById("filters-body");

openFiltersButton.addEventListener("click", () => {
  filtersBody.style.display = "flex";
  openFiltersButton.style.display = "none";
  closeFiltersButton.style.display = "block";
});

closeFiltersButton.addEventListener("click", () => {
  filtersBody.style.display = "none";
  openFiltersButton.style.display = "block";
  closeFiltersButton.style.display = "none";
});

let currentApplyHandler = null;

export function handleFilters(viewObjects, collections, setRenderable) {
  const criteriaFunctions = {};

  const initFilters = () => {
    filtersContent.replaceChildren();

    for (const collection of collections) {
      delete criteriaFunctions[collection];
      if (collection in filterDefinitions) {
        criteriaFunctions[collection] = buildFilters(
          collection,
          filtersContent,
          viewObjects,
        );
      }
    }

    const filters = document.getElementById("filters");
    if (Object.keys(criteriaFunctions).length === 0) {
      filters.style.display = "none";
    } else {
      filters.style.display = "block";
    }

    invertFilter.checked = false;
  };

  initFilters();

  const hideFilteredOut = (
    viewObjects,
    criteriaFunctions,
    inverted = false,
  ) => {
    for (const { collection } of Object.values(viewObjects.datatypes)) {
      for (const object of collection) {
        object.filteredOut = false;
      }
    }

    for (const [collectionName, criteriaFunction] of Object.entries(
      criteriaFunctions,
    )) {
      for (const object of viewObjects.datatypes[collectionName].collection) {
        const passes = criteriaFunction(object);
        object.filteredOut = inverted ? passes : !passes;
      }
    }
  };

  const apply = () => {
    hideFilteredOut(viewObjects, criteriaFunctions, invertFilter.checked);
    setRenderable(viewObjects);
  };

  if (currentApplyHandler) {
    filtersContent.removeEventListener("change", currentApplyHandler);
    filtersContent.removeEventListener("input", currentApplyHandler);
    invertFilter.removeEventListener("change", currentApplyHandler);
  }

  currentApplyHandler = apply;

  filtersContent.addEventListener("change", apply);
  filtersContent.addEventListener("input", apply);
  invertFilter.addEventListener("change", apply);

  const reset = () => {
    initFilters();
    hideFilteredOut(viewObjects, {}, false);
    setRenderable(viewObjects);
  };

  resetButton.onclick = reset;
}
