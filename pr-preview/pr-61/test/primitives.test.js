import { jest } from "@jest/globals";
import { drawRoundedRect, drawTex } from "../js/lib/graphic-primitives.js";

let ctx;

beforeEach(() => {
  ctx = {
    save: jest.fn(),
    fillStyle: null,
    beginPath: jest.fn(),
    roundRect: jest.fn(),
    fill: jest.fn(),
    strokeStyle: null,
    lineWidth: null,
    stroke: jest.fn(),
    restore: jest.fn(),
    drawImage: jest.fn(),
  };
});

afterEach(() => {
  ctx = null;
});

describe("drawRoundedRect", () => {
  it("should draw a rounded rectangle with the correct properties", () => {
    drawRoundedRect(ctx, 10, 20, 100, 200, "red", 15);

    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe("red");
    expect(ctx.beginPath).toHaveBeenCalledTimes(2);
    expect(ctx.roundRect).toHaveBeenCalledTimes(2);
    expect(ctx.roundRect).toHaveBeenNthCalledWith(1, 10, 20, 100, 200, 15);
    expect(ctx.roundRect).toHaveBeenNthCalledWith(2, 10, 20, 100, 200, 15);
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.strokeStyle).toBe("black");
    expect(ctx.lineWidth).toBe(2);
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });
});

describe("drawTex", () => {
  let texImg;

  beforeEach(() => {
    texImg = {
      naturalWidth: 200,
      naturalHeight: 100,
    };
  });

  afterEach(() => {
    texImg = null;
  });

  it("should draw an image with the correct properties", () => {
    drawTex(ctx, 10, 20, texImg, 50);

    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.drawImage).toHaveBeenCalledWith(texImg, -12.5, 8.75, 45, 22.5);
    expect(ctx.restore).toHaveBeenCalled();
  });

  it("should draw an image scaled to 2 if the scale is greater than 2", () => {
    drawTex(ctx, 10, 20, texImg, 500);

    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.drawImage).toHaveBeenCalledWith(texImg, -190, -80, 400, 200);
    expect(ctx.restore).toHaveBeenCalled();
  });
});
