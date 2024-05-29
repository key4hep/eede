export class Track {
  constructor() {
    // Physics properties
    this.type = 0;
    this.chi2 = 0;
    this.ndf = 0;
    this.dEdx = 0;
    this.dEdxError = 0;
    this.radiusOfInnermostHit = 0;
    this.subdetectorHitNumbers = [];
    this.dxQuantities = [];
    this.trackerHits = [];
    this.tracks = [];
  }
}
