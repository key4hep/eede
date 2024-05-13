import { Link } from "./objects.js";

export function reconnect(
  criteriaFunction,
  parentLinks,
  childrenLinks,
  particles
) {
  const filteredParticles = [];
  const newParentLinks = [];
  const newChildrenLinks = [];

  for (const particle of particles) {
    if (!criteriaFunction(particle)) {
      const parentParticles = [];
      const childrenParticles = [];

      for (const parent of particle.parents) {
        if (criteriaFunction(particles[parent])) {
          parentParticles.push(parent);
        }
      }

      for (const child of particle.children) {
        if (criteriaFunction(particles[child])) {
          childrenParticles.push(child);
        }
      }

      for (const parent of parentParticles) {
        for (const child of childrenParticles) {
          const link = new Link(newParentLinks.length, parent, child);
          newParentLinks.push(link);
        }
      }
    } else {
      filteredParticles.push(particle);

      for (const parentLinkId of particle.parentLinks) {
        const parentLink = parentLinks[parentLinkId];
        const parent = particles[parentLink.from];
        if (criteriaFunction(parent)) {
          newParentLinks.push(
            new Link(newParentLinks.length, parentLink.from, parentLink.to)
          );
        }
      }

      for (const childrenLinkId of particle.childrenLinks) {
        const childrenLink = childrenLinks[childrenLinkId];
        const child = particles[childrenLink.to];
        if (criteriaFunction(child)) {
          newChildrenLinks.push(
            new Link(
              newChildrenLinks.length,
              childrenLink.from,
              childrenLink.to
            )
          );
        }
      }
    }
  }

  return [filteredParticles, newParentLinks, newChildrenLinks];
}
