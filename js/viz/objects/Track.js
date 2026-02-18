import { EDMObject } from "./EDMObject.js";
import { addLinesToBox } from "../draw/box.js";

class Track extends EDMObject {
  constructor() {
    super();
    this.width = 140;
    this.height = 180;
    this.color = "#fff6df";
    this.radius = 25;
    this.titleName = "Track";
  }

  async draw() {
    const [box, nextY] = await super.draw();

    const lines = [];
    lines.push("ID: " + this.index);
    lines.push("type: " + this.type);
    const chi2 = parseInt(this.chi2 * 100) / 100;
    const ndf = parseInt(this.ndf * 100) / 100;
    const chiNdf = `${chi2}/${ndf}`;
    this.chiNdf = chiNdf;
    lines.push("chi2/ndf = " + chiNdf);
    lines.push("dEdx = " + this.dEdx);
    const trackerHitsCount = this.trackerHitsCount;
    lines.push("tracker hits: " + trackerHitsCount);

    addLinesToBox(lines, box, nextY);
  }

  static setup(trackCollection) {
    trackCollection.forEach((track) => {
      track.trackerHitsCount = track.oneToManyRelations["trackerHits"].length;
    });
  }
}

export { Track };
