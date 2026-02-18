import {
  checkboxLogic,
  objectSatisfiesCheckbox,
} from "../components/checkbox.js";
import { buildCollectionCheckboxes } from "../components/common.js";
import {
  addCollectionTitle,
  collectionFilterContainer,
} from "../components/lib.js";
import { RangeComponent, rangeLogic } from "../components/range.js";

function renderTrackFilters(viewObjects) {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Track");
  container.appendChild(title);

  const chiNdf = new RangeComponent("chiNdf", "chi^2/ndf", "");

  container.appendChild(chiNdf.render());

  const [collectionNamesContainer, collectionCheckboxes] =
    buildCollectionCheckboxes(
      viewObjects.datatypes["edm4hep::Track"].collection
    );
  container.appendChild(collectionNamesContainer);

  return {
    container,
    filters: {
      chiNdf,
      collectionCheckboxes,
    },
  };
}

export function initTrackFilters(parentContainer, viewObjects) {
  const { container, filters } = renderTrackFilters(viewObjects);
  const { chiNdf, collectionCheckboxes } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    const { min: minChiNdf, max: maxChiNdf } = chiNdf.getValues();

    if (!rangeLogic(minChiNdf, maxChiNdf, object, "chiNdf")) {
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
