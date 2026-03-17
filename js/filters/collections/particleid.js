import { filterOutByNormalCheckboxes } from "../components/checkbox.js";
import {
  addCollectionTitle,
  buildCheckboxes,
  buildEnumCheckboxGroup,
  collectionFilterContainer,
} from "../components/lib.js";
import { PARTICLEID } from "./types.js";

export function initParticleIdFilters(parentContainer, viewObjects) {
  const particleIds = viewObjects.datatypes[PARTICLEID].collection;
  const container = collectionFilterContainer();
  const typeValues = new Set(particleIds.map((p) => p.type));
  const pdgValues = new Set(particleIds.map((p) => p.PDG));
  const algorithmTypeValues = new Set(particleIds.map((p) => p.algorithmType));

  const { groupContainer: typeContainer, checkboxes: typeCheckboxes } =
    buildEnumCheckboxGroup("Type", "type", typeValues);
  const { groupContainer: pdgContainer, checkboxes: pdgCheckboxes } =
    buildEnumCheckboxGroup("PDG", "PDG", pdgValues);
  const {
    groupContainer: algorithmTypeContainer,
    checkboxes: algorithmTypeCheckboxes,
  } = buildEnumCheckboxGroup(
    "Algorithm Type",
    "algorithmType",
    algorithmTypeValues,
  );
  const [collContainer, collCheckboxes] = buildCheckboxes(particleIds);

  //  Assemble DOM
  container.appendChild(addCollectionTitle("Particle ID"));
  container.appendChild(typeContainer);
  container.appendChild(pdgContainer);
  container.appendChild(algorithmTypeContainer);
  container.appendChild(collContainer);
  parentContainer.appendChild(container);

  return (object) =>
    filterOutByNormalCheckboxes(object, [
      typeCheckboxes,
      pdgCheckboxes,
      algorithmTypeCheckboxes,
      collCheckboxes,
    ]);
}
