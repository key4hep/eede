import { EDMObject } from "./EDMObject.js";
import { addLinesToBox } from "../draw/box.js";
import { objectColor } from "../constants/vizStyles.js";

class ParticleID extends EDMObject {
  constructor() {
    super();
    this.width = 140;
    this.height = 160;
    this.titleName = "Particle ID";
    this.color = objectColor.purple100;
    this.colorOnHover = objectColor.purple200;
    this.colorOnClick = objectColor.purple300;
    this.lineColor = objectColor.purple400;
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
