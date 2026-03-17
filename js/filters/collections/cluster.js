import { satisfiesCollectionFilter } from "../components/checkbox.js";
import {
  addCollectionTitle,
  buildCheckboxes,
  collectionFilterContainer,
} from "../components/lib.js";
import {
  magnitudeRangeLogic,
  RangeComponent,
  rangeLogic,
} from "../components/range.js";
import { CLUSTER } from "./types.js";

export function initClusterFilters(parentContainer, viewObjects) {
  const clusters = viewObjects.datatypes[CLUSTER].collection;
  const container = collectionFilterContainer();
  const position = new RangeComponent("position", "position", "mm");
  const energy = new RangeComponent("energy", "energy", "GeV");
  const [collectionContainer, collectionCheckboxes] = buildCheckboxes(clusters);

  // Assemble DOM
  container.appendChild(addCollectionTitle("Cluster"));
  container.appendChild(collectionContainer);
  container.appendChild(position.render());
  container.appendChild(energy.render());
  parentContainer.appendChild(container);

  return (object) => {
    const { min: minPosition, max: maxPosition } = position.getValues();
    if (!magnitudeRangeLogic(minPosition, maxPosition, object, "position")) {
      return false;
    }

    const { min: minEnergy, max: maxEnergy } = energy.getValues();
    if (!rangeLogic(minEnergy, maxEnergy, object, "energy")) {
      return false;
    }

    return satisfiesCollectionFilter(object, collectionCheckboxes);
  };
}
