import { Link } from "../../objects.js";
import { drawAll } from "../../draw.js";
import { parentLinks, childrenLinks, infoBoxes, ctx } from "../../main.js";
import { Range, Checkbox } from "./parameters.js";

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

let parametersRange = ["momentum", "vertex", "time", "mass", "charge"];

parametersRange = parametersRange.map((parameter) => new Range(parameter));

parametersRange.forEach((parameter) => parameter.render(filters));

let bitsCheckbox = [23, 24, 25, 26, 27, 28, 29, 30];

bitsCheckbox = bitsCheckbox.map((bit) => new Checkbox(bit));

bitsCheckbox.forEach((checkbox) => checkbox.render(filters));

apply.addEventListener("click", () => {
  let rangeFunctions = parametersRange.map((parameter) =>
    parameter.buildCondition()
  );
  rangeFunctions = rangeFunctions.filter((fn) => fn);
  rangeFunctions = rangeFunctions.reduce((acc, fn) => acc && fn, true);

  let bitsFunction = bitsCheckbox.map((checkbox) => checkbox.buildCondition());
  bitsFunction = bitsFunction.filter((fn) => fn);
  bitsFunction = bitsFunction.reduce(
    (acc, fn) => {
      return (particle) => acc(particle) || fn(particle);
    },
    () => false
  );

  function criteriaFunction(particle) {
    if (
      typeof bitsFunction === "function" &&
      typeof rangeFunctions === "function"
    ) {
      return rangeFunctions(particle) && bitsFunction(particle);
    }

    if (typeof bitsFunction === "function") {
      return bitsFunction(particle);
    }

    return rangeFunctions(particle);
  }

  const [newParentLinks, newChildrenLinks, filteredParticles] = reconnect(
    criteriaFunction,
    parentLinks,
    childrenLinks,
    infoBoxes
  );

  drawAll(ctx, newParentLinks, newChildrenLinks, filteredParticles);
});

reset.addEventListener("click", () => {
  drawAll(ctx, parentLinks, childrenLinks, infoBoxes);

  filters.innerHTML = "";

  parametersRange.forEach((parameter) => {
    parameter.min = undefined;
    parameter.max = undefined;
    parameter.render(filters);
  });

  bitsCheckbox.forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.render(filters);
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
