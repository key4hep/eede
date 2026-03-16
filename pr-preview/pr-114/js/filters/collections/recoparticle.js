import {
  checkboxLogic,
  objectSatisfiesCheckbox,
} from "../components/checkbox.js";
import { buildCollectionCheckboxes } from "../components/common.js";
import {
  addCollectionTitle,
  collectionFilterContainer,
} from "../components/lib.js";
import { magnitudeRangeLogic, RangeComponent } from "../components/range.js";
import { rangeLogic } from "../components/range.js";

function renderRecoParticleFilters(viewObjects) {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Reconstructed Particle");
  container.appendChild(title);

  const energy = new RangeComponent("energy", "energy", "GeV");
  const charge = new RangeComponent("charge", "charge", "e");
  const momentum = new RangeComponent("momentum", "momentum", "GeV");

  const range = [energy, charge];

  range.forEach((rangeFilter) => {
    container.appendChild(rangeFilter.render());
  });

  container.appendChild(momentum.render());

  const [collectionNamesContainer, collectionCheckboxes] =
    buildCollectionCheckboxes(
      viewObjects.datatypes["edm4hep::ReconstructedParticle"].collection
    );

  container.appendChild(collectionNamesContainer);

  return {
    container,
    filters: {
      range,
      collectionCheckboxes,
      momentum,
    },
  };
}

export function initRecoParticleFilters(parentContainer, viewObjects) {
  const { container, filters } = renderRecoParticleFilters(viewObjects);
  const { range, collectionCheckboxes, momentum } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    for (const filter of range) {
      const { min, max } = filter.getValues();

      if (!rangeLogic(min, max, object, filter.propertyName)) {
        return false;
      }
    }

    const { min, max } = momentum.getValues();
    if (!magnitudeRangeLogic(min, max, object, "momentum")) {
      return false;
    }

    if (
      !objectSatisfiesCheckbox(
        object,
        collectionCheckboxes,
        "collectionName",
        checkboxLogic
      )
    ) {
      return false;
    }

    return true;
  };

  return criteriaFunction;
}
