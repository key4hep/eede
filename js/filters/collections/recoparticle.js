import { satisfiesCollectionFilter } from "../components/checkbox.js";
import {
  addCollectionTitle,
  buildCheckboxes,
  collectionFilterContainer,
} from "../components/lib.js";
import {
  magnitudeRangeLogic,
  RangeComponent,
  rangeLogic,
} from "../components/range.js";
import { RECOPARTICLE } from "./types.js";

export function initRecoParticleFilters(parentContainer, viewObjects) {
  const recoParticles = viewObjects.datatypes[RECOPARTICLE].collection;
  const container = collectionFilterContainer();
  const momentum = new RangeComponent("momentum", "momentum", "GeV");
  const [collContainer, collCheckboxes] = buildCheckboxes(recoParticles);
  const scalarRange = [
    new RangeComponent("energy", "energy", "GeV"),
    new RangeComponent("charge", "charge", "e"),
  ];

  // Assemble DOM
  container.appendChild(addCollectionTitle("Reconstructed Particle"));
  scalarRange.forEach((f) => container.appendChild(f.render()));
  container.appendChild(momentum.render());
  container.appendChild(collContainer);
  parentContainer.appendChild(container);

  return (object) => {
    const scalarPass = scalarRange.every(({ propertyName, getValues }) => {
      const { min, max } = getValues();
      return rangeLogic(min, max, object, propertyName);
    });
    if (!scalarPass) return false;

    const { min: minMomentum, max: maxMomentum } = momentum.getValues();
    if (!magnitudeRangeLogic(minMomentum, maxMomentum, object, "momentum")) {
      return false;
    }

    return satisfiesCollectionFilter(object, collCheckboxes);
  };
}
