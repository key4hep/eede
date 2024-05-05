import { InfoBox, Link } from "./objects.js";
import { mappings } from "../data/particles.js";

export function infoMsg(msg) {
  const msgDiv = document.getElementById("input-message");
  msgDiv.classList.add("mb-20");
  msgDiv.style.color = "gray";
  msgDiv.innerHTML = "<p>INFO: " + msg + "</p>";
}

export function errorMsg(msg) {
  const msgDiv = document.getElementById("input-message");
  msgDiv.classList.add("mb-20");
  msgDiv.style.color = "red";
  msgDiv.innerHTML = "<p>ERROR: " + msg + "</p>";
}

export function loadMCParticles(jsonData, eventNum,
  infoBoxes, parentLinks, childrenLinks) {
  const eventData = jsonData["Event " + eventNum];
  try {
    const mcParticles = Object.values(eventData).find(element => element.collType == "edm4hep::MCParticleCollection");
    for (const [i, particle] of mcParticles.collection.entries()) {
      const box = new InfoBox(i);
      box.pdg = particle.PDG;
      box.genStatus = particle.generatorStatus;
      box.simStatus = particle.simulatorStatus;
      box.momentum = Math.sqrt(Math.pow(particle.momentum.x, 2)
        + Math.pow(particle.momentum.y, 2)
        + Math.pow(particle.momentum.z, 2));
      box.momentum = Math.round(box.momentum * 100) / 100;
      box.vertex = Math.sqrt(Math.pow(particle.vertex.x, 2)
        + Math.pow(particle.vertex.y, 2)
        + Math.pow(particle.vertex.z, 2));
      box.vertex = Math.round(box.vertex * 100) / 100;
      box.px = Math.round(particle.momentum.x * 100) / 100;
      box.py = Math.round(particle.momentum.y * 100) / 100;
      box.pz = Math.round(particle.momentum.z * 100) / 100;

      box.vx = particle.vertex.x;
      box.vy = particle.vertex.y;
      box.vz = particle.vertex.z;

      box.charge = particle.charge;
      box.time = Math.round(particle.time * 100) / 100;
      box.mass = Math.round(particle.mass * 100) / 100;

      box.name = getName(particle.PDG);
      box.updateTexImg();

      if (particle.parents.length === 0 && particle.daughters.length === 0) {
        box.row = -1;
        console.log("WARNING: Standalone particle!");
      }

      if (particle.parents.length === 0) {
        box.row = 0;
      }

      for (const j in particle.parents) {
        const parentId = particle.parents[j].index;
        box.parents.push(parentId);
        const link = new Link(parseInt(parentLinks.length), parentId, i);
        link.color = "#A00";  // Darkish red
        link.xShift = 3;
        parentLinks.push(link);
        box.parentLinks.push(link.id);
      }

      for (const j in particle.daughters) {
        const childrenId = particle.daughters[j].index;
        box.children.push(childrenId);
        const link = new Link(parseInt(childrenLinks.length), i, childrenId);
        link.color = "#0A0";  // Darkish green
        link.xShift = -3;
        childrenLinks.push(link);
        box.childrenLinks.push(link.id);
      }

      infoBoxes.push(box);
    }
  } catch (err) {
    if (err instanceof TypeError) {
      return;
    }
  }

  const getMaxRow = function (parentIds) {
    let maxRow = -1;
    for (const parentId of parentIds) {
      if (infoBoxes[parentId].row === -1) {
        return -1;
      }

      if (infoBoxes[parentId].row > maxRow) {
        maxRow = infoBoxes[parentId].row;
      }
    }

    return maxRow;
  }

  let repeat = true;
  while (repeat) {
    repeat = false;
    for (const infoBox of infoBoxes) {
      if (infoBox.row >= 0) {
        continue;
      }
      const parentRow = getMaxRow(infoBox.parents);
      if (parentRow >= 0) {
        infoBox.row = parentRow + 1;
      } else {
        repeat = true;
      }
    }
  }
}


function getName(pdg) {
  const particle = mappings[pdg];

  if (particle !== undefined) return particle;

  console.log("PDG: " + pdg.toString());
  return "PDG: " + pdg.toString();
}
