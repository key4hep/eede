import { particlesMap } from "../constants/particleMappings.js";

export function getName(pdg) {
  const particle = particlesMap.get(String(pdg));

  if (particle !== undefined) {
    // console.log("Name: " + particle);
    return particle;
  }

  console.log("PDG: " + pdg.toString());
  return "PDG: " + pdg.toString();
}
