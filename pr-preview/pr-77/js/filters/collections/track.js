import {
  addCollectionTitle,
  collectionFilterContainer,
} from "../components/lib.js";
import { RangeComponent, rangeLogic } from "../components/range.js";

function renderTrackFilters() {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Track");
  container.appendChild(title);

  const chiNdf = new RangeComponent("chiNdf", "chi^2/ndf", "");

  container.appendChild(chiNdf.render());

  return {
    container,
    filters: {
      chiNdf,
    },
  };
}

export function initTrackFilters(parentContainer) {
  const { container, filters } = renderTrackFilters();
  const { chiNdf } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    const { min: minChiNdf, max: maxChiNdf } = chiNdf.getValues();

    if (!rangeLogic(minChiNdf, maxChiNdf, object, "chiNdf")) {
      return false;
    }

    return true;
  };

  return criteriaFunction;
}
