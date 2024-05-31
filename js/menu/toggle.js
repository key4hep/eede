export class Toggle {
  constructor(id) {
    this.isSliderActive = false;
    this.slider = document.getElementById(id);
  }

  init(callback) {
    this.slider.addEventListener("click", () => {
      this.isSliderActive = !this.isSliderActive;
      callback();
    });
  }
}
