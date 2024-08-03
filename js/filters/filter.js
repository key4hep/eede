import { copyObject } from "../lib/copy.js";
import { initClusterFilters } from "./collections/cluster.js";
import { initMCParticleFilters } from "./collections/mcparticle.js";
import { initRecoParticleFilters } from "./collections/recoparticle.js";
import { initTrackFilters } from "./collections/track.js";
import { initVertexFilters } from "./collections/vertex.js";
import { reconnect } from "./reconnect.js";

const map = {
  "edm4hep::MCParticle": initMCParticleFilters,
  "edm4hep::ReconstructedParticle": initRecoParticleFilters,
  "edm4hep::Cluster": initClusterFilters,
  "edm4hep::Track": initTrackFilters,
  "edm4hep::Vertex": initVertexFilters,
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

const filters = {
  apply: null,
  reset: null,
};

export function initFilters(
  { viewObjects, viewCurrentObjects },
  collections,
  { render, filterScroll, originalScroll, setRenderable }
) {
  const criteriaFunctions = {};

  const resetFiltersContent = () => {
    const content = document.getElementById("filters-content");
    content.replaceChildren();

    for (const collection of collections) {
      delete criteriaFunctions[collection];
      const init = map[collection];
      if (init) {
        const criteriaFunction = init(content);
        criteriaFunctions[collection] = criteriaFunction;
      }
    }

    const filters = document.getElementById("filters");
    if (Object.keys(criteriaFunctions).length === 0) {
      filters.style.display = "none";
    } else {
      filters.style.display = "block";
    }
  };

  resetFiltersContent();

  filters.apply = async () => {
    reconnect(viewObjects, viewCurrentObjects, criteriaFunctions);
    await render(viewCurrentObjects);
    filterScroll();
    setRenderable(viewCurrentObjects);
  };
  filters.reset = async () => {
    resetFiltersContent();
    copyObject(viewObjects, viewCurrentObjects);
    await render(viewCurrentObjects);
    originalScroll();
    setRenderable(viewCurrentObjects);
  };
}

const applyButton = document.getElementById("filter-apply");
applyButton.addEventListener("click", () => {
  filters.apply();
});

const resetButton = document.getElementById("filter-reset");
resetButton.addEventListener("click", () => {
  filters.reset();
});
