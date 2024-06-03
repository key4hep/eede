import { buildLoader, loadParticles } from "../js/types/load";

const data = {
  "Event 0": {
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
    "Jet": {
      "collID": 13,
      "collType": "edm4hep::ReconstructedParticleCollection",
      "collection": [
        {
          "charge": 1.0,
          "clusters": [],
          "covMatrix": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          "energy": 12.062528610229492,
          "goodnessOfPID": 0.0,
          "mass": 2.315242290496826,
          "momentum": {
            "x": 11.738886833190918,
            "y": 1.2114704847335815,
            "z": 0.9354811906814575,
          },
          "particleIDUsed": {
            "collectionID": -2,
            "index": -2,
          },
          "particleIDs": [
            {
              "collectionID": 4,
              "index": 45,
            },
          ],
          "particles": [
            {
              "collectionID": 14,
              "index": 24,
            },
            {
              "collectionID": 14,
              "index": 22,
            },
            {
              "collectionID": 14,
              "index": 74,
            },
            {
              "collectionID": 14,
              "index": 23,
            },
            {
              "collectionID": 14,
              "index": 25,
            },
            {
              "collectionID": 14,
              "index": 26,
            },
          ],
          "referencePoint": {
            "x": 0.0,
            "y": 0.0,
            "z": 0.0,
          },
          "startVertex": {
            "collectionID": -2,
            "index": -2,
          },
          "tracks": [],
          "type": 0,
        },
      ],
    },
    "edm4hepVersion": "0.7.0",
  },
};

describe("build loader", () => {
  it("should create a loader with a set of types", () => {
    const loadersConfig = ["ReconstructedParticle", "ParticleID"];
    const loader = buildLoader(loadersConfig, "0.7.0");

    expect(Object.values(loader).every((f) => typeof f === "function")).toBe(
      true
    );
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
