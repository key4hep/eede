import {
  CheckboxComponent,
  bitfieldCheckboxLogic,
  filterOutByNormalCheckboxes,
  objectSatisfiesCheckbox,
} from "../components/checkbox.js";
import { RangeComponent, rangeLogic } from "../components/range.js";
import { simStatusBitFieldDisplayValues } from "../../viz/types/simStatus.js";
import {
  addCollectionTitle,
  buildCheckboxes,
  buildEnumCheckboxGroup,
  collectionFilterContainer,
  createCheckboxContainer,
  createCollectionSubtitle,
  createSubContainer,
} from "../components/lib.js";
import { MCPARTICLE } from "./types.js";

export function initMCParticleFilters(parentContainer, viewObjects) {
  const mcParticles = viewObjects.datatypes[MCPARTICLE].collection;
  const simStatusCheckboxes = [];
  const container = collectionFilterContainer();
  const simStatusContainer = createSubContainer();
  const simStatusCheckboxesContainer = createCheckboxContainer();
  const [collContainer, collCheckboxes] = buildCheckboxes(mcParticles);
  const range = [
    new RangeComponent("charge", "charge", "e"),
    new RangeComponent("mass", "mass", "GeV"),
    new RangeComponent("momentum", "momentum", "GeV"),
    new RangeComponent("position", "position", "mm"),
    new RangeComponent("time", "time", "ns"),
    new RangeComponent("vertex", "vertex", "mm"),
  ];
  const generatorStatusValues = new Set(
    mcParticles.map((p) => p.generatorStatus),
  );
  const {
    groupContainer: generatorStatusContainer,
    checkboxes: generatorStatusCheckboxes,
  } = buildEnumCheckboxGroup(
    "Generator Status",
    "generatorStatus",
    generatorStatusValues,
  );

  Object.entries(simStatusBitFieldDisplayValues).forEach(([value, status]) => {
    const checkbox = new CheckboxComponent("simulatorStatus", status, value);

    simStatusCheckboxes.push(checkbox);
    const isPresent = mcParticles.some((p) =>
      bitfieldCheckboxLogic(value, p, "simulatorStatus"),
    );
    checkbox.checked(isPresent);
  });

  // Assemble DOM
  simStatusContainer.appendChild(createCollectionSubtitle("Simulator Status"));
  simStatusCheckboxes.forEach((cb) =>
    simStatusCheckboxesContainer.appendChild(cb.render()),
  );
  simStatusContainer.appendChild(simStatusCheckboxesContainer);
  container.appendChild(addCollectionTitle("MC Particle"));
  range.forEach((f) => container.appendChild(f.render()));
  container.appendChild(simStatusContainer);
  container.appendChild(generatorStatusContainer);
  container.appendChild(collContainer);
  parentContainer.appendChild(container);

  return (object) => {
    const rangePass = range.every(({ propertyName, getValues }) => {
      const { min, max } = getValues();
      return rangeLogic(min, max, object, propertyName);
    });
    if (!rangePass) return false;

    const anySimStatusChecked = simStatusCheckboxes.some(
      (cb) => cb.getValues().checked,
    );
    if (anySimStatusChecked) {
      const simStatusPass = objectSatisfiesCheckbox(
        object,
        simStatusCheckboxes,
        "simulatorStatus",
        bitfieldCheckboxLogic,
      );
      if (!simStatusPass) return false;
    }

    return filterOutByNormalCheckboxes(object, [
      generatorStatusCheckboxes,
      collCheckboxes,
    ]);
  };
}
