import { togglePDG, toggleId } from "./show-pdg.js";

export class Toggle {
  constructor(elementId, swicthId) {
    this.elementId = elementId;
    this.swicthId = swicthId;
    this.isSliderActive = false;
  }

  setActions(activeFunction, inactiveFunction) {
    const toggle = document.getElementById(this.swicthId);

    toggle.addEventListener("click", () => {
      this.isSliderActive = !this.isSliderActive;
      const viewCurrentObjects = this.getViewCurrentObjects();

      if (this.isSliderActive) {
        activeFunction(viewCurrentObjects);
      } else {
        inactiveFunction(viewCurrentObjects);
      }
    });
  }

  display() {
    const toggle = document.getElementById(this.elementId);
    toggle.style.display = "flex";
  }

  setViewCurrentObjects(viewCurrentObjects) {
    this.viewCurrentObjects = viewCurrentObjects;
  }

  getViewCurrentObjects() {
    return this.viewCurrentObjects;
  }
}

const pdgToggle = new Toggle("pdg-toggle", "pdg-toggle-switch");
pdgToggle.setActions(toggleId, togglePDG);

const togglesPerCollection = {
  "edm4hep::MCParticle": [pdgToggle],
};

export function setupToggles(collections, viewCurrentObjects) {
  const allToggles = document.getElementsByClassName("toggle");

  for (const toggle of allToggles) {
    toggle.style.display = "none";
  }

  let displayedToggles = 0;

  for (const collection of collections) {
    const togglesFromCollection = togglesPerCollection[collection];

    if (!togglesFromCollection) {
      continue;
    }

    for (const toggle of togglesFromCollection) {
      toggle.display();
      toggle.setViewCurrentObjects(viewCurrentObjects);
      displayedToggles++;
    }
  }

  if (displayedToggles === 0) {
    document.getElementById("toggles").style.display = "none";
  } else {
    document.getElementById("toggles").style.display = "block";
  }
}
