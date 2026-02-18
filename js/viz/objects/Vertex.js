import { EDMObject } from "./EDMObject.js";
import { addLinesToBox } from "../draw/box.js";
import { objectColor } from "../constants/vizStyles.js";

class Vertex extends EDMObject {
  constructor() {
    super();
    this.width = 155;
    this.height = 175;
    this.titleName = "Vertex";
    this.color = objectColor.fuchsia100;
    this.colorOnHover = objectColor.fuchsia200;
    this.colorOnClick = objectColor.fuchsia300;
    this.lineColor = objectColor.fuchsia400;
  }

  async draw() {
    const [box, nextY] = await super.draw();

    const lines = [];
    lines.push("ID: " + this.index);
    const x = parseInt(this.position.x * 100) / 100;
    const y = parseInt(this.position.y * 100) / 100;
    const z = parseInt(this.position.z * 100) / 100;
    lines.push(`pos = (x=${x},`);
    lines.push(`y=${y},`);
    lines.push(`z=${z}) mm`);
    const chi2 = parseInt(this.chi2 * 100) / 100;
    const ndf = parseInt(this.ndf * 100) / 100;
    const chiNdf = `${chi2}/${ndf}`;
    lines.push("chi2/ndf = " + chiNdf);

    addLinesToBox(lines, box, nextY);
  }

  static setup(vertexCollection) {}
}

export { Vertex };
