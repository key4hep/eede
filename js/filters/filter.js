import { copyObject } from "../lib/copy.js";
import {
  filterMCParticleCollection,
  initMCParticleFilters,
} from "./collections/mcparticle.js";
import { reconnect } from "./reconnect.js";

const map = {
  "edm4hep::MCParticle": {
    init: initMCParticleFilters,
    filter: filterMCParticleCollection,
  },
};

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

export function initFilters(
  { viewObjects, viewCurrentObjects },
  collections,
  { render, scroll, setRenderable }
) {
  const criteriaFunctions = {};

  const setupContent = () => {
    const content = document.getElementById("filters-content");
    content.replaceChildren();

    for (const collection of collections) {
      delete criteriaFunctions[collection];
      const { init } = map[collection];
      if (init) {
        const criteriaFunction = init(content);
        criteriaFunctions[collection] = criteriaFunction;
      }
    }
  };

  setupContent();

  const applyButton = document.getElementById("filter-apply");
  applyButton.addEventListener("click", async () => {
    reconnect({ viewObjects, viewCurrentObjects }, criteriaFunctions);
    await render(viewCurrentObjects);
    scroll();
    setRenderable(viewCurrentObjects);
  });

  const resetButton = document.getElementById("filter-reset");
  resetButton.addEventListener("click", async () => {
    setupContent();
    copyObject(viewObjects, viewCurrentObjects);
    await render(viewCurrentObjects);
    scroll();
    setRenderable(viewCurrentObjects);
  });
}
