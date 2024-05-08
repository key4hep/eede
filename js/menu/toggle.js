const toggle = document.getElementById("toggle");
const label = document.getElementById("toggle-label");
const slider = document.getElementsByClassName("slider")[0];

class Toggle {
  constructor() {
    this.isSliderActive = false;
  }

  init(infoBoxes, drawAll) {
    toggle.style.display = "flex";

    slider.addEventListener("click", () => {
      this.isSliderActive = !this.isSliderActive;

      if (this.isSliderActive) {
        label.innerText = "PDG";
        for (const infoBox of infoBoxes) {
          infoBox.updateTexImg(`${infoBox.pdg}`);
        }
      } else {
        label.innerText = "Name";
        for (const infoBox of infoBoxes) {
          infoBox.updateTexImg(infoBox.name);
        }
      }

      drawAll();
    });
  }
}

export default Toggle;
