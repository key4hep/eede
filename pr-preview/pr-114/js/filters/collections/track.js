import { satisfiesCollectionFilter } from "../components/checkbox.js";
import {
  addCollectionTitle,
  buildCheckboxes,
  collectionFilterContainer,
} from "../components/lib.js";
import { RangeComponent, rangeLogic } from "../components/range.js";
import { TRACK } from "./types.js";

export function initTrackFilters(parentContainer, viewObjects) {
  const tracks = viewObjects.datatypes[TRACK].collection;
  const chiNdf = new RangeComponent("chiNdf", "chi^2/ndf", "");
  const container = collectionFilterContainer();
  const [collContainer, collCheckboxes] = buildCheckboxes(tracks);

  // Assemble DOM
  container.appendChild(addCollectionTitle("Track"));
  container.appendChild(chiNdf.render());
  container.appendChild(collContainer);
  parentContainer.appendChild(container);

  return (object) => {
    const { min, max } = chiNdf.getValues();
    if (!rangeLogic(min, max, object, "chiNdf")) {
      return false;
    }

    return satisfiesCollectionFilter(object, collCheckboxes);
  };
}
