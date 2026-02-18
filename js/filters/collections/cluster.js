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

function renderClusterFilters(viewObjects) {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Cluster");
  container.appendChild(title);

  const position = new RangeComponent("position", "position", "mm");
  const energy = new RangeComponent("energy", "energy", "GeV");

  const [collectionNamesContainer, collectionCheckboxes] =
    buildCollectionCheckboxes(
      viewObjects.datatypes["edm4hep::Cluster"].collection
    );

  container.appendChild(collectionNamesContainer);
  container.appendChild(position.render());
  container.appendChild(energy.render());

  return {
    container,
    filters: {
      position,
      energy,
      collectionCheckboxes,
    },
  };
}

export function initClusterFilters(parentContainer, viewObjects) {
  const { container, filters } = renderClusterFilters(viewObjects);
  const { position, energy, collectionCheckboxes } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    const { min: minPosition, max: maxPosition } = position.getValues();
    const { min: minEnergy, max: maxEnergy } = energy.getValues();

    if (!magnitudeRangeLogic(minPosition, maxPosition, object, "position")) {
      return false;
    }

    if (!rangeLogic(minEnergy, maxEnergy, object, "energy")) {
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
