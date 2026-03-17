import { initClusterFilters } from "./collections/cluster.js";
import { initMCParticleFilters } from "./collections/mcparticle.js";
import { initParticleIdFilters } from "./collections/particleid.js";
import { initRecoParticleFilters } from "./collections/recoparticle.js";
import { initTrackFilters } from "./collections/track.js";
import { initVertexFilters } from "./collections/vertex.js";

const map = {
  "edm4hep::MCParticle": initMCParticleFilters,
  "edm4hep::ReconstructedParticle": initRecoParticleFilters,
  "edm4hep::Cluster": initClusterFilters,
  "edm4hep::Track": initTrackFilters,
  "edm4hep::Vertex": initVertexFilters,
  "edm4hep::ParticleID": initParticleIdFilters,
};

const openFiltersButton = document.getElementById("open-filter");
const closeFiltersButton = document.getElementById("close-filter");
const filtersBody = document.getElementById("filters-body");
const filtersContent = document.getElementById("filters-content");
const resetButton = document.getElementById("filter-reset");

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

export function initFilters(viewObjects, collections, setRenderable) {
  const criteriaFunctions = {};

  const apply = () => {
    hideFilteredOut(
      viewObjects,
      criteriaFunctions,
      document.getElementById("invert-filter").checked,
    );
    setRenderable(viewObjects);
  };

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

  const resetFiltersContent = () => {
    filtersContent.replaceChildren();

    for (const collection of collections) {
      delete criteriaFunctions[collection];
      const init = map[collection];
      if (init) {
        const criteriaFunction = init(filtersContent, viewObjects);
        criteriaFunctions[collection] = criteriaFunction;
      }
    }

    const filters = document.getElementById("filters");
    if (Object.keys(criteriaFunctions).length === 0) {
      filters.style.display = "none";
    } else {
      filters.style.display = "block";
    }

    document.getElementById("invert-filter").checked = false;
  };

  resetFiltersContent();

  filtersContent.addEventListener("change", apply);
  filtersContent.addEventListener("input", apply);

  const reset = () => {
    resetFiltersContent();
    hideFilteredOut(viewObjects, {}, false);
    setRenderable(viewObjects);
  };

  resetButton.onclick = reset;
}
