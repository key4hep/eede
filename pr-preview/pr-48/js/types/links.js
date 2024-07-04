import { drawBezierLink, drawStraightLink } from "../lib/graphic-primitives.js";

const colors = {
  "parents": "#AA0000",
  "daughters": "#00AA00",
  "mcreco": "#0000AA",
  "tracks": "#AAAA00",
  "clusters": "#00AAAA",
  "particles": "#AA00AA",
  "mcclusters": "#D8F1A0",
  "mctracks": "#fe5e41",
};

export class Link {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.color = "#A00";
    this.xShift = 0;
  }

  draw(ctx) {
    drawBezierLink(ctx, this);
  }

  isVisible(x, y, width, height) {
    const boxFrom = this.from;
    const boxTo = this.to;

    const fromX = boxFrom.x + boxFrom.width / 2;
    const fromY = boxFrom.y + boxFrom.height;
    const toX = boxTo.x + boxTo.width / 2;
    const toY = boxTo.y;

    const boxX = Math.min(fromX, toX);
    const boxWidth = Math.abs(fromX - toX);
    const boxY = Math.min(fromY, toY);
    const boxHeight = Math.abs(fromY - toY);

    /*
    console.log("boxX: ", this.boxX);
    console.log("boxY: ", this.boxY);
    console.log("boxWidth: ", this.boxWidth);
    console.log("boxHeight: ", this.boxHeight);
    */

    return (
      x + width > boxX &&
      x < boxX + boxWidth &&
      y + height > boxY &&
      y < boxY + boxHeight
    );
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

  draw(ctx) {
    drawStraightLink(ctx, this);
  }
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

class MCRecoTrackParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = colors["mctracks"];
    this.weight = weight;
  }

  draw(ctx) {
    drawStraightLink(ctx, this);
  }
}

class MCRecoClusterParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = colors["mcclusters"];
    this.weight = weight;
  }

  draw(ctx) {
    drawStraightLink(ctx, this);
  }
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
  "startVertex": Link,
};
