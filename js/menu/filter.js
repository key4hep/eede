import { Link } from "../objects.js";
import { drawAll } from "../draw.js";
import { parentLinks, childrenLinks, infoBoxes, ctx } from "../main.js";

class FilterParameter {
  constructor(name) {
    this.name = name;
  }

  render(container) {
    const label = document.createElement("label");
    label.textContent = this.name;
    container.appendChild(label);

    const inputMin = document.createElement("input");
    inputMin.type = "number";
    inputMin.placeholder = "min";
    container.appendChild(inputMin);

    const separator = document.createTextNode(" - ");
    container.appendChild(separator);

    const inputMax = document.createElement("input");
    inputMax.type = "number";
    inputMax.placeholder = "max";
    container.appendChild(inputMax);

    inputMin.addEventListener("input", () => {
      this.min = inputMin.value;
    });

    inputMax.addEventListener("input", () => {
      this.max = inputMax.value;
    });
  }

  buildCondition() {
    if (!this.min && !this.max) return null;

    return (particle) => {
      if (particle) {
        if (particle[this.name] < this.min) {
          return false;
        }

        if (particle[this.name] > this.max) {
          return false;
        }

        return true;
      }
    };
  }
}

const filterButton = document.getElementById("filter-button");
const openFilter = document.getElementById("open-filter");
const closeFilter = document.getElementById("close-filter");
const filterContent = document.getElementById("filter-content");

let active = false;

filterButton.addEventListener("click", () => {
  active = !active;

  if (active) {
    openFilter.style.display = "none";
    closeFilter.style.display = "block";
    filterContent.style.display = "flex";
  } else {
    openFilter.style.display = "block";
    closeFilter.style.display = "none";
    filterContent.style.display = "none";
  }
});

const filters = document.getElementById("filters");
const apply = document.getElementById("filter-apply");
const reset = document.getElementById("filter-reset");

let parameters = ["momentum", "vertex", "time", "mass", "charge"];

parameters = parameters.map((parameter) => new FilterParameter(parameter));

parameters.forEach((parameter) => parameter.render(filters));

apply.addEventListener("click", () => {
  const functions = parameters.map((parameter) => parameter.buildCondition());

  let newParentLinks = parentLinks;
  let newChildrenLinks = childrenLinks;
  let filteredParticles = infoBoxes;

  for (const func of functions) {
    if (!func) continue;
    const [updatedParentLinks, updatedChildrenLinks, updatedParticles] =
      reconnect(func, newParentLinks, newChildrenLinks, filteredParticles);

    newParentLinks = updatedParentLinks;
    newChildrenLinks = updatedChildrenLinks;
    filteredParticles = updatedParticles;

    console.log(newParentLinks, newChildrenLinks, filteredParticles);
  }

  drawAll(ctx, newParentLinks, newChildrenLinks, filteredParticles);
});

reset.addEventListener("click", () => {
  drawAll(ctx, parentLinks, childrenLinks, infoBoxes);

  filters.innerHTML = "";

  parameters.forEach((parameter) => {
    parameter.min = undefined;
    parameter.max = undefined;
    parameter.render(filters);
  });
});

function reconnect(criteriaFunction, parentLinks, childrenLinks, particles) {
  const newParentLinks = [];
  const newChildrenLinks = [];
  const filteredParticles = [];

  for (const particle of particles) {
    if (!particle) continue;

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
        if (!parentLink) continue;
        const parent = particles[parentLink.from];
        if (criteriaFunction(parent)) {
          newParentLinks.push(parentLink);
        }
      }

      for (const childrenLinkId of particle.childrenLinks) {
        const childrenLink = childrenLinks[childrenLinkId];
        if (!childrenLink) continue;
        const child = particles[childrenLink.to];
        if (criteriaFunction(child)) {
          newChildrenLinks.push(childrenLink);
        }
      }
    }
  }

  return [newParentLinks, newChildrenLinks, filteredParticles];
}
