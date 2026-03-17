import { satisfiesCollectionFilter } from "../components/checkbox.js";
import {
  addCollectionTitle,
  buildCheckboxes,
  collectionFilterContainer,
} from "../components/lib.js";
import { magnitudeRangeLogic, RangeComponent } from "../components/range.js";
import { VERTEX } from "./types.js";

export function initVertexFilters(parentContainer, viewObjects) {
  const vertices = viewObjects.datatypes[VERTEX].collection;
  const position = new RangeComponent("position", "position", "mm");
  const [collContainer, collCheckboxes] = buildCheckboxes(vertices);
  const container = collectionFilterContainer();

  // Assemble DOM
  container.appendChild(addCollectionTitle("Vertex"));
  container.appendChild(position.render());
  container.appendChild(collContainer);
  parentContainer.appendChild(container);

  return (object) => {
    const { min, max } = position.getValues();
    if (!magnitudeRangeLogic(min, max, object, "position")) {
      return false;
    }

    return satisfiesCollectionFilter(object, collCheckboxes);
  };
}
