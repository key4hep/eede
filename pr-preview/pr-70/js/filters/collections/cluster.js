import {
  addCollectionTitle,
  collectionFilterContainer,
} from "../components/lib.js";
import { magnitudeRangeLogic, RangeComponent } from "../components/range.js";
import { rangeLogic } from "../components/range.js";

function renderClusterFilters() {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Cluster");
  container.appendChild(title);

  const position = new RangeComponent("position", "position", "mm");
  const energy = new RangeComponent("energy", "energy", "GeV");

  container.appendChild(position.render());
  container.appendChild(energy.render());

  return {
    container,
    filters: {
      position,
      energy,
    },
  };
}

export function initClusterFilters(parentContainer) {
  const { container, filters } = renderClusterFilters();
  const { position, energy } = filters;

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

    return true;
  };

  return criteriaFunction;
}
