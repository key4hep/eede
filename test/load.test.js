import { buildLoader, loadParticles } from "../js/types/load";

const data = {
  "Event 0": {
    "AllMuon": {
      "collID": 12,
      "collType": "edm4hep::ReconstructedParticleCollection",
      "collection": [],
    },
    "EFlowPhoton": {
      "collID": 7,
      "collType": "edm4hep::ClusterCollection",
      "collection": [
        {
          "clusters": [],
          "directionError": {
            "x": 0.0,
            "y": 0.0,
            "z": 0.0,
          },
          "energy": 6.2020978927612305,
          "energyError": 0.0,
          "hits": [],
          "iTheta": 0.0,
          "particleIDs": [],
          "phi": 0.0,
          "position": {
            "x": 0.0,
            "y": 0.0,
            "z": 0.0,
          },
          "positionError": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          "shapeParameters": [],
          "subdetectorEnergies": [],
          "type": 0,
        },
      ],
    },
  },
};

describe("build loader", () => {
  it("should create a loader with a set of types", () => {
    const loadersConfig = ["ReconstructedParticle", "ParticleID"];
    const loader = buildLoader(loadersConfig);
    const loaderFunctions = loadersConfig.map((type) => loader.getLoader(type));

    expect(loaderFunctions.every((f) => typeof f === "function")).toBe(true);
  });

  it("should fail when requesting a loader that doesn't exist", () => {
    const loadersConfig = ["ReconstructedParticle", "ParticleID"];
    const loader = buildLoader(loadersConfig);

    expect(loader.getLoader("Vertex")).toBe(false);
  });
});

describe("load different types of particles", () => {
  it("should only load particles of one type", () => {
    const loadersConfig = "ReconstructedParticle";

    const particles = loadParticles(data, "0", loadersConfig);

    expect(particles.hasOwnProperty(loadersConfig)).toBe(true);
  });

  it("should load particles of multiple types", () => {
    const loadersConfig = ["ReconstructedParticle", "Cluster"];

    const particles = loadParticles(data, "0", loadersConfig);

    expect(loadersConfig.every((type) => particles.hasOwnProperty(type))).toBe(
      true
    );
  });
});
