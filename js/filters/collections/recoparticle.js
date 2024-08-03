import {
  addCollectionTitle,
  collectionFilterContainer,
} from "../components/lib.js";
import { RangeComponent } from "../components/range.js";
import { rangeLogic } from "../components/range.js";

function renderRecoParticleFilters() {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Reconstructed Particle");
  container.appendChild(title);

  const energy = new RangeComponent("energy", "energy", "GeV");
  const charge = new RangeComponent("charge", "charge", "e");
  const momentum = new RangeComponent("momentum", "momentum", "GeV");

  const range = [energy, charge, momentum];

  range.forEach((rangeFilter) => {
    container.appendChild(rangeFilter.render());
  });

  return {
    container,
    filters: {
      range,
    },
  };
}

export function initRecoParticleFilters(parentContainer) {
  const { container, filters } = renderRecoParticleFilters();
  const { range } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    for (const filter of range) {
      const { min, max } = filter.getValues();

      if (!rangeLogic(min, max, object, filter.propertyName)) {
        return false;
      }
    }

    return true;
  };

  return criteriaFunction;
}
