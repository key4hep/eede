import { EDMObject } from "./EDMObject.js";
import { addLinesToBox } from "../draw/box.js";
import { objectColor } from "../constants/vizStyles.js";

class Cluster extends EDMObject {
  constructor() {
    super();
    this.width = 145;
    this.height = 200;
    this.titleName = "Cluster";
    this.color = objectColor.indigo100;
    this.colorOnHover = objectColor.indigo200;
    this.colorOnClick = objectColor.indigo300;
    this.lineColor = objectColor.indigo400;
  }

  async draw() {
    const [box, nextY] = await super.draw();

    const lines = [];
    lines.push("ID: " + this.index);
    lines.push("type: " + this.type);
    const energy = parseInt(this.energy * 100) / 100;
    lines.push("e = " + energy + " GeV");
    const x = parseInt(this.position.x * 100) / 100;
    const y = parseInt(this.position.y * 100) / 100;
    const z = parseInt(this.position.z * 100) / 100;
    lines.push(`pos = (x=${x},`);
    lines.push(`y=${y},`);
    lines.push(`z=${z}) mm`);

    addLinesToBox(lines, box, nextY);
  }

  static setup(clusterCollection) {}
}

export { Cluster };
