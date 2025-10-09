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

function renderVertexFilters(viewObjects) {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Vertex");
  container.appendChild(title);

  const position = new RangeComponent("position", "position", "mm");

  container.appendChild(position.render());

  const [collectionNamesContainer, collectionCheckboxes] =
    buildCollectionCheckboxes(
      viewObjects.datatypes["edm4hep::Vertex"].collection
    );
  container.appendChild(collectionNamesContainer);

  return {
    container,
    filters: {
      position,
      collectionCheckboxes,
    },
  };
}

export function initVertexFilters(parentContainer, viewObjects) {
  const { container, filters } = renderVertexFilters(viewObjects);
  const { position, collectionCheckboxes } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    const { min: minPosition, max: maxPosition } = position.getValues();

    if (!magnitudeRangeLogic(minPosition, maxPosition, object, "position")) {
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
