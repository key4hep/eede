import { InfoBox, Link } from "../js/objects";

describe("InfoBox", () => {
  let infoBox;

  beforeEach(() => {
    infoBox = new InfoBox(1);
  });

  afterEach(() => {
    infoBox = null;
  });

  it("should initialize with correct values", () => {
    expect(infoBox.id).toBe(1);
    expect(infoBox.x).toBe(0);
    expect(infoBox.y).toBe(0);
    expect(infoBox.width).toBe(120);
    expect(infoBox.height).toBe(240);
    expect(infoBox.lineColor).toBe("black");
    expect(infoBox.lineWidth).toBe(2);
    expect(infoBox.color).toBe("white");
    expect(infoBox.row).toBe(-1);
    expect(infoBox.texImg).toBe(null);
    expect(infoBox.name).toBe("");
    expect(infoBox.momentum).toBe(0);
    expect(infoBox.px).toBe(0);
    expect(infoBox.py).toBe(0);
    expect(infoBox.pz).toBe(0);
    expect(infoBox.vertex).toBe(0);
    expect(infoBox.vx).toBe(0);
    expect(infoBox.vy).toBe(0);
    expect(infoBox.vz).toBe(0);
    expect(infoBox.time).toBe(0);
    expect(infoBox.mass).toBe(0);
    expect(infoBox.charge).toBe(0);
    expect(infoBox.pdg).toBe(0);
    expect(infoBox.genStatus).toBe(0);
    expect(infoBox.simStatus).toBe(0);
    expect(infoBox.parents).toEqual([]);
    expect(infoBox.children).toEqual([]);
    expect(infoBox.parentLinks).toEqual([]);
    expect(infoBox.childrenLinks).toEqual([]);
  });

  it("should return true if (x, y) coordinates are within the box", () => {
    const x = 60;
    const y = 120;

    expect(infoBox.isHere(x, y)).toBe(true);
  });

  it("should return false if x coordinate is outside the box", () => {
    const x = 200;
    const y = 120;

    expect(infoBox.isHere(x, y)).toBe(false);
  });

  it("should return false if y coordinate is outside the box", () => {
    const x = 50;
    const y = -1;

    expect(infoBox.isHere(x, y)).toBe(false);
  });

  it("should return true if box is visible within the given area", () => {
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(infoBox.isVisible(x, y, width, height)).toBe(true);
  });

  it("should return false if the box is to the right of the area", () => {
    infoBox.x = 300;
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(infoBox.isVisible(x, y, width, height)).toBe(false);
  });

  it("should return false if the box is to the left of the area", () => {
    infoBox.x = -300;
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(infoBox.isVisible(x, y, width, height)).toBe(false);
  });

  it("should return false if the box is below the area", () => {
    infoBox.y = 300;
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(infoBox.isVisible(x, y, width, height)).toBe(false);
  });

  it("should return false if the box is above the area", () => {
    infoBox.y = -300;
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(infoBox.isVisible(x, y, width, height)).toBe(false);
  });
});

describe("Link", () => {
  let link;

  beforeEach(() => {
    link = new Link(1, 0, 1);
  });

  afterEach(() => {
    link = null;
  });

  it("should construct correctly", () => {
    expect(link.id).toBe(1);
    expect(link.from).toBe(0);
    expect(link.to).toBe(1);
    expect(link.color).toBe("#A00");
    expect(link.xShift).toBe(0);
  });

  let firstInfoBox, secondInfoBox, infoBoxes;

  beforeEach(() => {
    firstInfoBox = new InfoBox(0);
    secondInfoBox = new InfoBox(1);
    infoBoxes = [firstInfoBox, secondInfoBox];
  });

  it("should return true if the link is visible", () => {
    secondInfoBox.x = 140;
    secondInfoBox.y = 250;

    expect(link.isVisible(0, 0, 250, 250, infoBoxes)).toBe(true);
  });

  it("should return false if the link is not visible", () => {
    expect(link.isVisible(10, 10, 50, 50, infoBoxes)).toBe(false);
  });
});
