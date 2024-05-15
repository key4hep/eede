import { Link } from "../objects.js";
import { Toggle } from "./toggle.js";

export class Filter extends Toggle {
  constructor(id) {
    super(id);
  }

  toggle(criteriaFunction, parentLinks, childrenLinks, particles, drawAll) {
    if (this.isSliderActive) {
      const [newParentLinks, newChildrenLinks, newParticles] = reconnect(
        criteriaFunction,
        parentLinks,
        childrenLinks,
        particles
      );
      drawAll(newParentLinks, newChildrenLinks, newParticles);
    } else {
      drawAll(parentLinks, childrenLinks, particles);
    }
  }
}

function reconnect(criteriaFunction, parentLinks, childrenLinks, particles) {
  const newParentLinks = [];
  const newChildrenLinks = [];
  const filteredParticles = [];

  for (const particle of particles) {
    if (!criteriaFunction(particle)) {
      filteredParticles.push(null);

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
        const parent = particles[parentLink.from];
        if (criteriaFunction(parent)) {
          newParentLinks.push(parentLink);
        }
      }

      for (const childrenLinkId of particle.childrenLinks) {
        const childrenLink = childrenLinks[childrenLinkId];
        const child = particles[childrenLink.to];
        if (criteriaFunction(child)) {
          newChildrenLinks.push(childrenLink);
        }
      }
    }
  }

  return [newParentLinks, newChildrenLinks, filteredParticles];
}
