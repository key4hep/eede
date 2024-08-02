import { togglePDG, toggleId } from "./show-pdg.js";

export class Toggle {
  constructor() {
    this.isSliderActive = false;
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("toggle");
    const span = document.createElement("span");
    span.classList.add("toggle-label");
    span.textContent = "Show PDG IDs";
    div.appendChild(span);
    const label = document.createElement("label");
    label.classList.add("switch");
    const input = document.createElement("input");
    input.type = "checkbox";
    const slider = document.createElement("span");
    this.slider = slider;
    slider.classList.add("slider");
    slider.classList.add("round");
    label.appendChild(input);
    label.appendChild(slider);
    div.appendChild(label);

    return div;
  }

  setActions(activeFunction, inactiveFunction) {
    const newFunction = () => {
      this.isSliderActive = !this.isSliderActive;
      if (this.isSliderActive) {
        activeFunction();
      } else {
        inactiveFunction();
      }
    };

    this.slider.removeEventListener("click", prev.function);
    this.slider.addEventListener("click", newFunction);
    prev.function = newFunction;
  }
}

const pdgToggle = new Toggle();
// pdgToggle.setActions(
//   () => {
//     toggleId(viewCurrentObjects);
//   },
//   () => {
//     togglePDG(viewCurrentObjects);
//   }
// );
const togglesPerCollection = {
  "edm4hep::MCParticle": [pdgToggle],
};

export function setupToggles(collections) {
  for (const collection in collections) {
    const togglesFromCollection = togglesPerCollection[collection];

    if (togglesFromCollection !== undefined) {
      const body = document.querySelector("body");

      for (const toggle of togglesFromCollection) {
        const toggleElement = toggle.render();
        body.appendChild(toggleElement);
      }
    }
  }
}
