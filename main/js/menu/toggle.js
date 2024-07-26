const prev = {
  function: null,
};

export class Toggle {
  constructor(id) {
    this.isSliderActive = false;
    this.slider = document.getElementById(id);
  }

  init(activeFunction, inactiveFunction) {
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
