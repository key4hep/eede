import {
  CheckboxComponent,
  checkboxLogic,
  bitfieldCheckboxLogic,
} from "../components/checkbox.js";
import { RangeComponent, rangeLogic } from "../components/range.js";
import { SimStatusBitFieldDisplayValues } from "../../../mappings/sim-status.js";
import {
  addCollectionTitle,
  collectionFilterContainer,
  createCheckboxContainer,
  createCollectionSubtitle,
  createSubContainer,
} from "../components/lib.js";

function renderMCParticleFilters() {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("MC Particle");
  container.appendChild(title);

  const charge = new RangeComponent("charge", "charge", "e");
  const mass = new RangeComponent("mass", "mass", "GeV");
  const momentum = new RangeComponent("momentum", "momentum", "GeV");
  const position = new RangeComponent("position", "position", "mm");
  const time = new RangeComponent("time", "time", "ns");
  const vertex = new RangeComponent("vertex", "vertex", "mm");

  const range = [charge, mass, momentum, position, time, vertex];

  range.forEach((rangeFilter) => {
    container.appendChild(rangeFilter.render());
  });

  const checkboxes = {
    simStatus: [],
    generatorStatus: [],
  };

  const simStatusContainer = createSubContainer();
  const simStatusTitle = createCollectionSubtitle("Simulator Status");
  simStatusContainer.appendChild(simStatusTitle);
  const simStatusCheckboxesContainer = createCheckboxContainer();

  Object.keys(SimStatusBitFieldDisplayValues).forEach((status) => {
    const checkbox = new CheckboxComponent(
      "simulatorStatus",
      status,
      SimStatusBitFieldDisplayValues[status]
    );
    checkboxes.simStatus.push(checkbox);
    simStatusCheckboxesContainer.appendChild(checkbox.render());
  });
  simStatusContainer.appendChild(simStatusCheckboxesContainer);

  const generatorStatusContainer = createSubContainer();
  const generatorStatusTitle = createCollectionSubtitle("Generator Status");
  generatorStatusContainer.appendChild(generatorStatusTitle);
  const genStatusCheckboxesContainer = createCheckboxContainer();

  [1, 2, 3, 4].map((status) => {
    const checkbox = new CheckboxComponent(
      "generatorStatus",
      status,
      status,
      false
    );
    checkboxes.generatorStatus.push(checkbox);
    genStatusCheckboxesContainer.appendChild(checkbox.render());
  });
  generatorStatusContainer.appendChild(genStatusCheckboxesContainer);

  container.appendChild(simStatusContainer);
  container.appendChild(generatorStatusContainer);

  return {
    container,
    filters: {
      range,
      checkboxes,
    },
  };
}

export function initMCParticleFilters(parentContainer) {
  const { container, filters } = renderMCParticleFilters();
  const { range, checkboxes } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    for (const filter of range) {
      const { min, max } = filter.getValues();
      if (!rangeLogic(min, max, object, filter.propertyName)) {
        return false;
      }
    }

    const { simStatus, generatorStatus } = checkboxes;

    for (const checkbox of simStatus) {
      const { checked, value } = checkbox.getValues();
      if (!bitfieldCheckboxLogic(checked, value, object, "simulatorStatus")) {
        return false;
      }
    }

    for (const checkbox of generatorStatus) {
      const { checked, value } = checkbox.getValues();
      if (!checkboxLogic(checked, value, object, "generatorStatus")) {
        return false;
      }
    }

    return true;
  };

  return criteriaFunction;
}
