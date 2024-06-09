export class Version {
  constructor(string) {
    const [major, minor, patch] = string.split(".");
    this.major = parseInt(major);
    this.minor = parseInt(minor);
    this.patch = parseInt(patch);
  }

  toString() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  greaterOrEqualThan(version) {
    return (
      this.major > version.major ||
      (this.major === version.major &&
        (this.minor > version.minor ||
          (this.minor === version.minor && this.patch >= version.patch)))
    );
  }

  lessOrEqualThan(version) {
    return (
      this.major < version.major ||
      (this.major === version.major &&
        (this.minor < version.minor ||
          (this.minor === version.minor && this.patch <= version.patch)))
    );
  }

  isBetween(version1, version2) {
    return this.greaterOrEqualThan(version1) && this.lessOrEqualThan(version2);
  }
}

export function compatible(type, version) {
  const minV = new Version(type.MIN_VERSION);
  const maxV = new Version(type.MAX_VERSION);

  const v = new Version(version);

  return v.isBetween(minV, maxV);
}
