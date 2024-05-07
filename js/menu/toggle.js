const toggle = document.getElementById("toggle");
const slider = document.getElementsByClassName("slider")[0];

class Toggle {
  constructor() {
    this.isSliderActive = false;
  }

  init(infoBoxes, drawAll) {
    toggle.style.display = "block";

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
