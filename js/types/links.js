import { drawBezierLink } from "../draw/link.js";

const colors = {
  "parents": "#AA0000",
  "daughters": "#00AA00",
  "mcreco": "#0000AA",
  "tracks": "#AAAA00",
  "clusters": "#00AAAA",
  "particles": "#AA00AA",
  "mcclusters": "#D8F1A0",
  "mctracks": "#fe5e41",
  "vertex": "#593746",
};

export class Link {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.color = "#A00";
    this.xShift = 0;
  }

  draw() {
    drawBezierLink(this);
  }
}

class ParentLink extends Link {
  constructor(from, to) {
    super(to, from);
    this.color = colors["parents"];
    this.xShift = 3;
    // parent is this.from
    // current object is this.to
  }
}

class DaughterLink extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = colors["daughters"];
    this.xShift = -3;
    // current object is this.from
    // daughter is this.to
  }
}

class MCRecoParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = colors["mcreco"];
    this.weight = weight;
  }

  // draw(ctx) {
  //   drawStraightLink(ctx, this);
  // }
}

class Particles extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = colors["particles"];
  }
}

class Clusters extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = colors["clusters"];
  }
}

class Tracks extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = colors["tracks"];
  }
}

class Vertex extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = colors["vertex"];
  }
}

class MCRecoTrackParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = colors["mctracks"];
    this.weight = weight;
  }

  // draw(ctx) {
  //   drawStraightLink(ctx, this);
  // }
}

class MCRecoClusterParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = colors["mcclusters"];
    this.weight = weight;
  }

  // draw(ctx) {
  //   drawStraightLink(ctx, this);
  // }
}

export const linkTypes = {
  "parents": ParentLink,
  "daughters": DaughterLink,
  "edm4hep::MCRecoParticleAssociation": MCRecoParticleAssociation,
  "edm4hep::MCRecoClusterParticleAssociation": MCRecoClusterParticleAssociation,
  "edm4hep::MCRecoTrackParticleAssociation": MCRecoTrackParticleAssociation,
  "clusters": Clusters,
  "tracks": Tracks,
  "particles": Particles,
  "particle": Particles,
  "startVertex": Vertex,
  "associatedParticle": Vertex,
};
