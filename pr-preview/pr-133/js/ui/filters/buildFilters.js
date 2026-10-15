// Build filters and logic based on input type

// UI logic
import {
  CheckboxComponent,
  buildEnumCheckboxes,
  buildBitfieldCheckboxes,
  createCheckboxContainer,
} from "./components/checkbox.js";
import { RangeComponent } from "./components/range.js";
import {
  addCollectionTitle,
  collectionFilterContainer,
  createCollectionSubtitle,
  createSubContainer,
} from "./components/lib.js";
import { filterDefinitions } from "./defineFilters.js";

// Constants
import { simStatusBitFieldDisplayValues } from "../../lib/constants/simStatus.js";

export function buildFilters(typeName, parentContainer, viewObjects) {
  const definition = filterDefinitions[typeName];
  const collection = viewObjects.datatypes[typeName].collection;
  const container = collectionFilterContainer();
  container.appendChild(addCollectionTitle(definition.label));

  const buildRangeFilter = (f) => {
    // Build a range filter
    const range = new RangeComponent(f.property, f.label, f.unit);
    container.appendChild(range.render());

    // Return a function that checks whether a property value falls within the selected range
    return (object) => {
      const { min, max } = range.getValues();
      const minVal = parseFloat(min);
      const maxVal = parseFloat(max);

      let cur = object[range.propertyName];
      if (f.type === "magnitudeRange") {
        cur = Math.sqrt(
          Object.values(cur).reduce((acc, val) => acc + val ** 2, 0),
        );
      }

      if (Number.isFinite(minVal) && Number.isFinite(maxVal)) {
        return cur >= minVal && cur <= maxVal;
      } else if (Number.isFinite(minVal)) {
        return cur >= minVal;
      } else if (Number.isFinite(maxVal)) {
        return cur <= maxVal;
      }
      return true;
    };
  };

  const buildEnumFilter = (f) => {
    // Build checkboxes for each value of a property
    const values = new Set(collection.map((obj) => obj[f.property]));
    const element = buildEnumCheckboxes(f.label, f.property, values);
    container.appendChild(element.groupContainer);

    // Return a function that passes when the object matches at least one checked value
    return (object) => {
      for (const cb of element.checkboxes) {
        const { checked, value } = cb.getValues();
        if (checked && object[f.property] === value) return true;
      }

      return false;
    };
  };

  const buildBitfieldFilter = (f) => {
    // Build checkboxes for each individual bit in a bitfield property
    const subContainer = createSubContainer();
    subContainer.appendChild(createCollectionSubtitle(f.label));
    const checkboxesContainer = createCheckboxContainer();

    // Create no status checkbox
    const noStatusCheckbox = new CheckboxComponent(f.property, "No status", 0);
    checkboxesContainer.appendChild(noStatusCheckbox.render());
    const hasNoStatus = collection.some(
      (obj) => parseInt(obj[f.property]) === 0,
    );
    noStatusCheckbox.checked(hasNoStatus);

    // Create the other checkboxes
    const checkboxes = [];
    for (const [value, displayName] of Object.entries(
      simStatusBitFieldDisplayValues,
    )) {
      const checkbox = new CheckboxComponent(f.property, displayName, value);
      checkboxes.push(checkbox);
      checkboxesContainer.appendChild(checkbox.render());
      const isPresent = collection.some(
        (obj) =>
          (parseInt(obj[f.property]) & (1 << parseInt(checkbox.value))) !== 0,
      );
      checkbox.checked(isPresent);
    }

    subContainer.appendChild(checkboxesContainer);
    container.appendChild(subContainer);

    // Return a function that passes when the object matches at least one checked bit, has no status, or no checkboxes are checked
    return (object) => {
      if (parseInt(object[f.property]) === 0)
        return noStatusCheckbox.getValues().checked;

      for (const cb of checkboxes) {
        const { checked, value } = cb.getValues();
        if (!checked) continue;
        if ((parseInt(object[f.property]) & (1 << parseInt(value))) !== 0)
          return true;
      }

      return !checkboxes.some((cb) => cb.getValues().checked);
    };
  };

  const buildCollectionFilter = () => {
    // Builds a checkbox per collection name
    const [collContainer, collCheckboxes] = buildBitfieldCheckboxes(collection);
    container.appendChild(collContainer);

    // Return a function that passes when the object belongs to a checked collection.
    return (object) => {
      for (const cb of collCheckboxes) {
        const { checked, value } = cb.getValues();
        if (checked && object.collectionName === value) return true;
      }
      return false;
    };
  };

  const tests = [];

  for (const filterDef of definition.filters) {
    switch (filterDef.type) {
      case "scalarRange":
      case "magnitudeRange":
        tests.push(buildRangeFilter(filterDef));
        break;
      case "enumCheckbox":
        tests.push(buildEnumFilter(filterDef));
        break;
      case "bitfieldCheckbox":
        tests.push(buildBitfieldFilter(filterDef));
        break;
    }
  }

  tests.push(buildCollectionFilter());

  parentContainer.appendChild(container);

  return (object) => tests.every((test) => test(object));
}
