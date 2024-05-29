export class Vertex {
  constructor() {
    // Physics properties
    this.primary = 0;
    this.chi2 = 0;
    this.probability = 0;
    this.position = 0; // mm
    this.covMatrix = [];
    this.algorithmType = 0;
    this.parameters = 0;
    this.associatedParticles = [];
  }
}
