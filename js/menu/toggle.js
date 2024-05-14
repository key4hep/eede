const toggle = document.getElementById("toggle");
const slider = document.getElementById("show-pdg");

class Toggle {
  constructor() {
    this.isSliderActive = false;
  }

  init(infoBoxes, drawAll) {
    toggle.style.display = "flex";

    slider.addEventListener("click", () => {
      this.isSliderActive = !this.isSliderActive;

      if (this.isSliderActive) {
        for (const infoBox of infoBoxes) {
          infoBox.updateTexImg(`${infoBox.pdg}`);
        }
      } else {
        for (const infoBox of infoBoxes) {
          infoBox.updateTexImg(infoBox.name);
        }
      }

      drawAll();
    });
  }
}

export default Toggle;
