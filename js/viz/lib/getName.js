import { mappings } from "../constants/particles.js";

export function getName(pdg) {
  const particle = mappings.get(String(pdg));

  if (particle !== undefined) {
    // console.log("Name: " + particle);
    return particle;
  }

  console.log("PDG: " + pdg.toString());
  return "PDG: " + pdg.toString();
}
