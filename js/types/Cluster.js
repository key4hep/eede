export class Cluster {
  constructor() {
    // Physics properties
    this.type = 0;
    this.energy = 0; // GeV
    this.energyError = 0; // GeV
    this.position = []; // mm
    this.positionError = [];
    this.iTheta = 0;
    this.phi = 0;
    this.directionError; // mm^2
    this.shapeParameters = [];
    this.subdetectorEnergies = [];
    this.clusters = [];
    this.hits = [];
  }
}
