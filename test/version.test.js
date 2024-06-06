import { Version, compatible } from "../js/types/version.js";

describe("version class methods", () => {
  let version;

  beforeAll(() => {
    version = new Version("1.12.4");
  });

  it("should return a string", () => {
    expect(version.toString()).toBe("1.12.4");
  });

  describe("greater version than current", () => {
    let greaterVersion;

    beforeAll(() => {
      greaterVersion = new Version("1.12.5");
    });

    it("should return false", () => {
      expect(version.greaterOrEqualThan(greaterVersion)).toBe(false);
    });

    it("should return true", () => {
      expect(version.lessOrEqualThan(version)).toBe(true);
    });
  });

  describe("smaller version than current", () => {
    let lessVersion;

    beforeAll(() => {
      lessVersion = new Version("1.5.4");
    });

    it("should return false", () => {
      expect(version.lessOrEqualThan(lessVersion)).toBe(false);
    });

    it("should return true", () => {
      expect(version.greaterOrEqualThan(version)).toBe(true);
    });
  });

  it("should return true if version is between", () => {
    const version1 = new Version("1.0.0");
    const version2 = new Version("2.0.0");

    expect(version.isBetween(version1, version2)).toBe(true);
  });

  it("should return false if version is not between", () => {
    const version1 = new Version("0.7.0");
    const version2 = new Version("1.12.3");

    expect(version.isBetween(version1, version2)).toBe(false);
  });
});

describe("compatible function", () => {
  let type;

  beforeAll(() => {
    type = {
      MIN_VERSION: "0.7.0",
      MAX_VERSION: "1.0.0",
    };
  });

  it("should be compatible", () => {
    expect(compatible(type, "0.7.0")).toBe(true);
  });

  it("should not be compatible with a greater version", () => {
    expect(compatible(type, "1.0.1")).toBe(false);
  });
});
