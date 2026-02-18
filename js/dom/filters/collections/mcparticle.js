import {
  CheckboxComponent,
  bitfieldCheckboxLogic,
  objectSatisfiesCheckbox,
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
import {
  buildCollectionCheckboxes,
  filterOutByNormalCheckboxes,
} from "../components/common.js";

function renderMCParticleFilters(viewObjects) {
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

  Object.entries(SimStatusBitFieldDisplayValues).forEach(([value, status]) => {
    const checkbox = new CheckboxComponent("simulatorStatus", status, value);
    checkboxes.simStatus.push(checkbox);
    simStatusCheckboxesContainer.appendChild(checkbox.render());

    viewObjects.datatypes["edm4hep::MCParticle"].collection.forEach(
      (mcparticle) => {
        if (bitfieldCheckboxLogic(value, mcparticle, "simulatorStatus")) {
          checkbox.checked(true);
        }
      }
    );
  });
  simStatusContainer.appendChild(simStatusCheckboxesContainer);

  const generatorStatusContainer = createSubContainer();
  const generatorStatusTitle = createCollectionSubtitle("Generator Status");
  generatorStatusContainer.appendChild(generatorStatusTitle);
  const genStatusCheckboxesContainer = createCheckboxContainer();

  const generatorStatus = new Set();
  viewObjects.datatypes["edm4hep::MCParticle"].collection.forEach(
    (mcparticle) => generatorStatus.add(mcparticle.generatorStatus)
  );

  generatorStatus.forEach((status) => {
    const checkbox = new CheckboxComponent(
      "generatorStatus",
      status,
      status,
      true
    );
    checkboxes.generatorStatus.push(checkbox);
    genStatusCheckboxesContainer.appendChild(checkbox.render());
    checkbox.checked(true);
  });
  generatorStatusContainer.appendChild(genStatusCheckboxesContainer);

  const [collectionNamesContainer, collectionCheckboxes] =
    buildCollectionCheckboxes(
      viewObjects.datatypes["edm4hep::MCParticle"].collection
    );
  checkboxes.collectionNames = collectionCheckboxes;

  container.appendChild(simStatusContainer);
  container.appendChild(generatorStatusContainer);
  container.appendChild(collectionNamesContainer);

  return {
    container,
    filters: {
      range,
      checkboxes,
    },
  };
}

export function initMCParticleFilters(parentContainer, viewObjects) {
  const { container, filters } = renderMCParticleFilters(viewObjects);
  const { range, checkboxes } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (object) => {
    for (const filter of range) {
      const { min, max } = filter.getValues();
      if (!rangeLogic(min, max, object, filter.propertyName)) {
        return false;
      }
    }

    const { simStatus, generatorStatus, collectionNames } = checkboxes;

    let areSimStatusChecked = false;

    simStatus.forEach((checkbox) => {
      const { checked } = checkbox.getValues();

      if (checked) {
        areSimStatusChecked = true;
      }
    });

    const someSimStatusCheckbox = objectSatisfiesCheckbox(
      object,
      simStatus,
      "simulatorStatus",
      bitfieldCheckboxLogic
    );
    const normalCheckboxes = filterOutByNormalCheckboxes(object, [
      generatorStatus,
      collectionNames,
    ]);

    if (areSimStatusChecked) {
      return someSimStatusCheckbox && normalCheckboxes;
    } else {
      return normalCheckboxes;
    }
  };

  return criteriaFunction;
}
