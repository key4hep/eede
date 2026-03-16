import {
  CheckboxComponent,
  checkboxLogic,
  objectSatisfiesCheckbox,
} from "../components/checkbox.js";
import {
  buildCollectionCheckboxes,
  filterOutByNormalCheckboxes,
} from "../components/common.js";
import {
  addCollectionTitle,
  collectionFilterContainer,
  createCheckboxContainer,
  createCollectionSubtitle,
  createSubContainer,
} from "../components/lib.js";

function renderParticleIdFilters(viewObjects) {
  const container = collectionFilterContainer();
  const title = addCollectionTitle("Particle ID");
  container.appendChild(title);

  const checkboxes = {
    type: [],
    pdg: [],
    algorithmType: [],
  };

  const typeContainer = createSubContainer();
  const typeTitle = createCollectionSubtitle("Type");
  typeContainer.appendChild(typeTitle);
  const typeCheckboxesContainer = createCheckboxContainer();
  const typeSet = new Set();
  viewObjects.datatypes["edm4hep::ParticleID"].collection.forEach(
    (particleId) => typeSet.add(particleId.type)
  );
  typeSet.forEach((type) => {
    const checkbox = new CheckboxComponent("type", type, type, true);
    checkboxes.type.push(checkbox);
    typeCheckboxesContainer.appendChild(checkbox.render());
    checkbox.checked(true);
  });
  typeContainer.appendChild(typeCheckboxesContainer);

  const pdgContainer = createSubContainer();
  const pdgTitle = createCollectionSubtitle("PDG");
  pdgContainer.appendChild(pdgTitle);
  const pdgCheckboxesContainer = createCheckboxContainer();
  const pdgSet = new Set();
  viewObjects.datatypes["edm4hep::ParticleID"].collection.forEach(
    (particleId) => pdgSet.add(particleId.PDG)
  );
  pdgSet.forEach((pdg) => {
    const checkbox = new CheckboxComponent("PDG", pdg, pdg, true);
    checkboxes.pdg.push(checkbox);
    pdgCheckboxesContainer.appendChild(checkbox.render());
    checkbox.checked(true);
  });
  pdgContainer.appendChild(pdgCheckboxesContainer);

  const algorithmTypeContainer = createSubContainer();
  const algorithmTypeTitle = createCollectionSubtitle("Algorithm Type");
  algorithmTypeContainer.appendChild(algorithmTypeTitle);
  const algorithmTypeCheckboxesContainer = createCheckboxContainer();
  const algorithmTypeSet = new Set();
  viewObjects.datatypes["edm4hep::ParticleID"].collection.forEach(
    (particleId) => algorithmTypeSet.add(particleId.algorithmType)
  );
  algorithmTypeSet.forEach((algorithmType) => {
    const checkbox = new CheckboxComponent(
      "algorithmType",
      algorithmType,
      algorithmType,
      true
    );
    checkboxes.algorithmType.push(checkbox);
    algorithmTypeCheckboxesContainer.appendChild(checkbox.render());
    checkbox.checked(true);
  });
  algorithmTypeContainer.appendChild(algorithmTypeCheckboxesContainer);

  const [collectionNamesContainer, collectionCheckboxes] =
    buildCollectionCheckboxes(
      viewObjects.datatypes["edm4hep::ParticleID"].collection
    );
  checkboxes.collectionNames = collectionCheckboxes;

  container.appendChild(typeContainer);
  container.appendChild(pdgContainer);
  container.appendChild(algorithmTypeContainer);
  container.appendChild(collectionNamesContainer);

  return {
    container,
    filters: {
      checkboxes,
    },
  };
}

export function initParticleIdFilters(parentContainer, viewObjects) {
  const { container, filters } = renderParticleIdFilters(viewObjects);
  const { checkboxes } = filters;

  parentContainer.appendChild(container);

  const criteriaFunction = (particleId) => {
    return filterOutByNormalCheckboxes(particleId, Object.values(checkboxes));
  };

  return criteriaFunction;
}
