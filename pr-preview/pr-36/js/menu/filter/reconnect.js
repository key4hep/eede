import { Link } from "../../objects.js";

export function reconnect(criteriaFunction, particlesHandler) {
  const { parentLinks, childrenLinks, infoBoxes } = particlesHandler;

  const newParentLinks = [];
  const newChildrenLinks = [];
  const filteredParticles = [];

  for (const particle of infoBoxes) {
    if (!criteriaFunction(particle)) {
      filteredParticles.push(null);

      const parentParticles = [];
      const childrenParticles = [];

      for (const parent of particle.parents) {
        if (criteriaFunction(infoBoxes[parent])) {
          parentParticles.push(parent);
        }
      }

      for (const child of particle.children) {
        if (criteriaFunction(infoBoxes[child])) {
          childrenParticles.push(child);
        }
      }

      for (const parent of parentParticles) {
        for (const child of childrenParticles) {
          const linkToParent = new Link(newParentLinks.length, parent, child);
          linkToParent.xShift = 3;
          const linkToChild = new Link(newChildrenLinks.length, parent, child);
          linkToChild.color = "#0A0";
          linkToChild.xShift = -3;

          newParentLinks.push(linkToParent);
          newChildrenLinks.push(linkToChild);
        }
      }
    } else {
      filteredParticles.push(particle);

      for (const parentLinkId of particle.parentLinks) {
        const parentLink = parentLinks[parentLinkId];
        const parent = infoBoxes[parentLink.from];
        if (criteriaFunction(parent)) {
          const parentLinkCopy = new Link(
            newParentLinks.length,
            parentLink.from,
            parentLink.to
          );
          parentLinkCopy.xShift = 3;
          newParentLinks.push(parentLinkCopy);
        }
      }

      for (const childrenLinkId of particle.childrenLinks) {
        const childrenLink = childrenLinks[childrenLinkId];
        const child = infoBoxes[childrenLink.to];
        if (criteriaFunction(child)) {
          const childrenLinkCopy = new Link(
            newChildrenLinks.length,
            childrenLink.from,
            childrenLink.to
          );
          childrenLinkCopy.color = "#0A0";
          childrenLinkCopy.xShift = -3;
          newChildrenLinks.push(childrenLinkCopy);
        }
      }
    }
  }

  return [newParentLinks, newChildrenLinks, filteredParticles];
}
