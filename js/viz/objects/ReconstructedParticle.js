import { EDMObject } from "./EDMObject.js";
import { parseCharge } from "../lib/parseCharge.js";
import { addLinesToBox } from "../draw/box.js";
import { objectColor } from "../constants/vizStyles.js";

class ReconstructedParticle extends EDMObject {
  constructor() {
    super();
    this.width = 170;
    this.height = 200;
    this.titleName = "Reconstructed\nParticle";
    this.color = objectColor.blue100;
    this.colorOnHover = objectColor.blue200;
    this.colorOnClick = objectColor.blue300;
    this.lineColor = objectColor.blue400;
  }

  async draw() {
    let [box, nextY] = await super.draw();

    const lines = [];

    lines.push("ID: " + this.index);
    const x = parseInt(this.momentum.x * 100) / 100;
    const y = parseInt(this.momentum.y * 100) / 100;
    const z = parseInt(this.momentum.z * 100) / 100;
    lines.push(`p = (x=${x},`);
    lines.push(`y=${y},`);
    lines.push(`z=${z}) GeV`);
    const energy = parseInt(this.energy * 100) / 100;
    lines.push("e = " + energy + " GeV");
    lines.push(parseCharge(this.charge));

    addLinesToBox(lines, box, nextY);
  }

  static setup(recoCollection) {}
}

export { ReconstructedParticle };
