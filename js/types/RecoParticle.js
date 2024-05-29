export class ReconstructedParticle {
  constructor() {
    // Physics properties
    this.pdg = 0;
    this.energy = 0; // GeV
    this.momentum = 0; // GeV
    this.referencePoint = 0; // mm
    this.charge = 0;
    this.mass = 0; // GeV
    this.goodnessOfPID = 0;
    this.covMatrix = [];
    this.startVertex = [];
    this.clusters = [];
    this.tracks = [];
    this.particles = [];
  }
}
