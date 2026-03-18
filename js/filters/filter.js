import {
  CheckboxComponent,
  bitfieldCheckboxLogic,
  filterOutByNormalCheckboxes,
  objectSatisfiesCheckbox,
  buildEnumCheckboxes,
  buildBitfieldCheckboxes,
  createCheckboxContainer,
} from "./components/checkbox.js";
import {
  RangeComponent,
  scalarRangeLogic,
  magnitudeRangeLogic,
} from "./components/range.js";
import {
  addCollectionTitle,
  collectionFilterContainer,
  createCollectionSubtitle,
  createSubContainer,
} from "./components/lib.js";
import { filterDefinitions } from "./definitions.js";

const openFiltersButton = document.getElementById("open-filter");
const closeFiltersButton = document.getElementById("close-filter");
const filtersBody = document.getElementById("filters-body");
const filtersContent = document.getElementById("filters-content");
const resetButton = document.getElementById("filter-reset");

openFiltersButton.addEventListener("click", () => {
  filtersBody.style.display = "flex";
  openFiltersButton.style.display = "none";
  closeFiltersButton.style.display = "block";
});

closeFiltersButton.addEventListener("click", () => {
  filtersBody.style.display = "none";
  openFiltersButton.style.display = "block";
  closeFiltersButton.style.display = "none";
});

function buildCollectionFilters(typeName, parentContainer, viewObjects) {
  const definition = filterDefinitions[typeName];
  const collection = viewObjects.datatypes[typeName].collection;
  const container = collectionFilterContainer();
  container.appendChild(addCollectionTitle(definition.label));

  const scalarRangeFilters = [];
  const magnitudeRangeFilters = [];
  const enumCheckboxGroups = [];
  const bitfieldGroups = [];

  for (const filterDef of definition.filters) {
    switch (filterDef.type) {
      case "scalarRange": {
        const range = new RangeComponent(
          filterDef.property,
          filterDef.label,
          filterDef.unit,
        );
        container.appendChild(range.render());
        scalarRangeFilters.push(range);
        break;
      }
      case "magnitudeRange": {
        const range = new RangeComponent(
          filterDef.property,
          filterDef.label,
          filterDef.unit,
        );
        container.appendChild(range.render());
        magnitudeRangeFilters.push(range);
        break;
      }
      case "enumCheckbox": {
        const values = new Set(
          collection.map((obj) => obj[filterDef.property]),
        );
        const { groupContainer, checkboxes } = buildEnumCheckboxes(
          filterDef.label,
          filterDef.property,
          values,
        );
        container.appendChild(groupContainer);
        enumCheckboxGroups.push(checkboxes);
        break;
      }
      case "bitfieldCheckbox": {
        const subContainer = createSubContainer();
        subContainer.appendChild(createCollectionSubtitle(filterDef.label));
        const checkboxesContainer = createCheckboxContainer();
        const checkboxes = [];

        Object.entries(filterDef.options).forEach(([value, displayName]) => {
          const checkbox = new CheckboxComponent(
            filterDef.property,
            displayName,
            value,
          );
          checkboxes.push(checkbox);
        });

        checkboxes.forEach((cb) =>
          checkboxesContainer.appendChild(cb.render()),
        );

        checkboxes.forEach((cb) => {
          const isPresent = collection.some((obj) =>
            bitfieldCheckboxLogic(cb.value, obj, filterDef.property),
          );
          cb.checked(isPresent);
        });

        subContainer.appendChild(checkboxesContainer);
        container.appendChild(subContainer);
        bitfieldGroups.push({ checkboxes, property: filterDef.property });
        break;
      }
    }
  }

  const [collContainer, collCheckboxes] = buildBitfieldCheckboxes(collection);
  container.appendChild(collContainer);
  parentContainer.appendChild(container);

  return (object) => {
    for (const filter of scalarRangeFilters) {
      const { min, max } = filter.getValues();
      if (!scalarRangeLogic(min, max, object, filter.propertyName))
        return false;
    }

    for (const filter of magnitudeRangeFilters) {
      const { min, max } = filter.getValues();
      if (!magnitudeRangeLogic(min, max, object, filter.propertyName))
        return false;
    }

    for (const { checkboxes, property } of bitfieldGroups) {
      const anyChecked = checkboxes.some((cb) => cb.getValues().checked);
      if (
        anyChecked &&
        !objectSatisfiesCheckbox(
          object,
          checkboxes,
          property,
          bitfieldCheckboxLogic,
        )
      ) {
        {
          return false;
        }
      }
    }

    return filterOutByNormalCheckboxes(object, [
      ...enumCheckboxGroups,
      collCheckboxes,
    ]);
  };
}

export function handleFilters(viewObjects, collections, setRenderable) {
  const criteriaFunctions = {};

  const apply = () => {
    hideFilteredOut(
      viewObjects,
      criteriaFunctions,
      document.getElementById("invert-filter").checked,
    );
    setRenderable(viewObjects);
  };

  const hideFilteredOut = (
    viewObjects,
    criteriaFunctions,
    inverted = false,
  ) => {
    for (const { collection } of Object.values(viewObjects.datatypes)) {
      for (const object of collection) {
        object.filteredOut = false;
      }
    }

    for (const [collectionName, criteriaFunction] of Object.entries(
      criteriaFunctions,
    )) {
      for (const object of viewObjects.datatypes[collectionName].collection) {
        const passes = criteriaFunction(object);
        object.filteredOut = inverted ? passes : !passes;
      }
    }
  };

  const initFilters = () => {
    filtersContent.replaceChildren();

    for (const collection of collections) {
      delete criteriaFunctions[collection];
      if (collection in filterDefinitions) {
        criteriaFunctions[collection] = buildCollectionFilters(
          collection,
          filtersContent,
          viewObjects,
        );
      }
    }

    const filters = document.getElementById("filters");
    if (Object.keys(criteriaFunctions).length === 0) {
      filters.style.display = "none";
    } else {
      filters.style.display = "block";
    }

    document.getElementById("invert-filter").checked = false;
  };

  initFilters();

  filtersContent.addEventListener("change", apply);
  filtersContent.addEventListener("input", apply);

  const reset = () => {
    initFilters();
    hideFilteredOut(viewObjects, {}, false);
    setRenderable(viewObjects);
  };

  resetButton.onclick = reset;
}
