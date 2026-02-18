import { getContainer } from "../draw/app.js";
import { drawBezierLink } from "../draw/link.js";
import { linkColors } from "../constants/styles.js";

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

  isVisible() {
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

    const viewport = getContainer();

    return (
      viewport.right > boxX &&
      viewport.left < boxX + boxWidth &&
      viewport.bottom > boxY &&
      viewport.top < boxY + boxHeight
    );
  }
}

export class ParentLink extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = linkColors["parents"];
    this.xShift = 3;
  }

  draw() {
    drawBezierLink(this, true);
  }
}

export class DaughterLink extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = linkColors["daughters"];
    this.xShift = -3;
  }
}

export class MCRecoParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = linkColors["mcreco"];
    this.weight = weight;
  }

  // draw(ctx) {
  //   drawStraightLink(ctx, this);
  // }
}

export class Particles extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = linkColors["particles"];
  }
}

export class Clusters extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = linkColors["clusters"];
  }
}

export class Tracks extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = linkColors["tracks"];
  }
}

export class Vertex extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = linkColors["vertex"];
  }
}

export class ParticleIDLink extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = linkColors["particle-id"];
  }
}

export class MCRecoTrackParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = linkColors["mctracks"];
    this.weight = weight;
  }

  // draw(ctx) {
  //   drawStraightLink(ctx, this);
  // }
}

export class MCRecoClusterParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = linkColors["mcclusters"];
    this.weight = weight;
  }

  // draw(ctx) {
  //   drawStraightLink(ctx, this);
  // }
}
