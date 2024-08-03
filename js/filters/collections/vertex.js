import {
  addCollectionTitle,
  collectionFilterContainer,
} from "../components/lib.js";
import { magnitudeRangeLogic, RangeComponent } from "../components/range.js";

function renderVertexFilters() {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Vertex");
  container.appendChild(title);

  const position = new RangeComponent("position", "position", "mm");

  container.appendChild(position.render());

  return {
    container,
    filters: {
      position,
    },
  };
}

export function initVertexFilters(parentContainer) {
  const { container, filters } = renderVertexFilters();
  const { position } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    const { min: minPosition, max: maxPosition } = position.getValues();

    if (!magnitudeRangeLogic(minPosition, maxPosition, object, "position")) {
      return false;
    }

    return true;
  };

  return criteriaFunction;
}
