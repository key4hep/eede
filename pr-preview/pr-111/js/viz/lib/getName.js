import { particlesId } from "../types/particleMappings.js";

export function getName(pdg) {
  const particle = particlesId.get(String(pdg));

  if (particle !== undefined) {
    // console.log("Name: " + particle);
    return particle;
  }

  console.log("PDG: " + pdg.toString());
  return "PDG: " + pdg.toString();
}
