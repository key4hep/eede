import { buildLoader, loadParticles, dynamicLoad } from "../js/types/load";
import { ReconstructedParticle } from "../js/types/reconstruction";

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
  let data = {};

  beforeAll(() => {
    data = {
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
        "ReconstructedParticles": {
          "collID": 14,
          "collType": "edm4hep::ReconstructedParticleCollection",
          "collection": [
            {
              "charge": 1.0,
              "clusters": [],
              "covMatrix": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
              "energy": 0.358455091714859,
              "goodnessOfPID": 0.0,
              "mass": 0.13957038521766663,
              "momentum": {
                "x": 0.09558331221342087,
                "y": -0.11288221180438995,
                "z": -0.2951807975769043,
              },
              "particleIDUsed": {
                "collectionID": -2,
                "index": -2,
              },
              "particleIDs": [
                {
                  "collectionID": 4,
                  "index": 0,
                },
              ],
              "particles": [],
              "referencePoint": {
                "x": 0.0,
                "y": 0.0,
                "z": 0.0,
              },
              "startVertex": {
                "collectionID": -2,
                "index": -2,
              },
              "tracks": [
                {
                  "collectionID": 3,
                  "index": 0,
                },
              ],
              "type": 0,
            },
          ],
        },
        "edm4hepVersion": "0.7.0",
      },
    };
  });

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

describe("dynamically load an object", () => {
  let particleData = {};
  let reconstructedParticle;

  beforeAll(() => {
    particleData = {
      "PDG": 3,
      "charge": 0.0,
      "clusters": [],
      "covMatrix": {
        "values": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      },
      "energy": 9.644623756408691,
      "goodnessOfPID": 0.0,
      "mass": 0.45484575629234314,
      "momentum": {
        "x": -4.557793617248535,
        "y": -6.684719085693359,
        "z": 5.230002403259277,
      },
      "particles": [
        {
          "collectionID": 4196981182,
          "index": 20,
        },
        {
          "collectionID": 4196981182,
          "index": 19,
        },
      ],
      "referencePoint": {
        "x": -1.2017582654953003,
        "y": -2.118278741836548,
        "z": 1.424477458000183,
      },
      "startVertex": {
        "collectionID": 4294967295,
        "index": -1,
      },
      "tracks": [],
    };
  });

  beforeEach(() => {
    reconstructedParticle = new ReconstructedParticle();
    reconstructedParticle.index = 0;
  });

  it("should load all the properties of an object", () => {
    dynamicLoad(reconstructedParticle, particleData);

    expect(reconstructedParticle).toMatchObject(particleData);
  });

  it("should ignore some properties of an object", () => {
    const ignore = new Set(["PDG", "charge", "particles"]);

    dynamicLoad(reconstructedParticle, particleData, ignore);
    expect(reconstructedParticle).toMatchObject({
      ...particleData,
      PDG: 0,
      charge: 0,
      particles: [],
    });
  });
});
