import { EDMObject } from "./EDMObject.js";
import { addLinesToBox } from "../draw/box.js";

class ParticleID extends EDMObject {
  constructor() {
    super();
    this.width = 140;
    this.height = 160;
    this.color = "#c9edf7";
    this.radius = 25;
    this.titleName = "Particle ID";
  }

  async draw() {
    const [box, nextY] = await super.draw();

    const lines = [];
    lines.push("ID: " + this.index);
    lines.push("type: " + this.type);
    lines.push("PDG: " + this.PDG);
    lines.push("algorithm: " + this.algorithmType);
    lines.push("likelihood: " + this.likelihood);

    addLinesToBox(lines, box, nextY);
  }

  static setup(particleIDCollection) {}
}

export { ParticleID };
