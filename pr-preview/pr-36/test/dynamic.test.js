import {
  loadMembers,
  loadOneToOneRelations,
  loadOneToManyRelations,
} from "../js/types/dynamic.js";

let object;
let data;

beforeEach(() => {
  object = {
    "id": 1,
  };
  data = {};
});

test("load members given some defined members and data", () => {
  const members = [
    {
      "name": "type",
    },
    {
      "name": "chi2",
    },
    {
      "name": "ndf",
    },
    {
      "name": "dEdx",
    },
    {
      "name": "dEdxError",
    },
    {
      "name": "radiusOfInnermostHit",
    },
  ];
  data = {
    "chi2": 0.0,
    "dEdx": 0.0,
    "dEdxError": 0.0,
    "dxQuantities": [
      {
        "error": 0.0,
        "type": 0,
        "value": 0.0,
      },
    ],
    "ndf": 0,
    "radiusOfInnermostHit": 17.0,
    "subDetectorHitNumbers": [],
    "trackStates": [
      {
        "D0": 0.13514114916324615,
        "Z0": -0.10983038693666458,
        "covMatrix": [
          0.01773529127240181, -0.0011217461433261633, 7.128114521037787e-5,
          2.307129989276291e-7, -1.38431239804504e-8, 1.2183726250114546e-10,
          9.953266999218613e-5, -6.313419817161048e-6, 2.394112907921908e-9,
          0.019905241206288338, -3.138819374726154e-5, 1.986780489460216e-6,
          -4.870325809314124e-10, -0.001264480990357697, 8.076488302322105e-5,
          0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        ],
        "location": 0,
        "omega": 0.004053603857755661,
        "phi": -0.8681905269622803,
        "referencePoint": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0,
        },
        "tanLambda": -1.99562406539917,
        "time": 0.0,
      },
    ],
    "trackerHits": [
      {
        "collectionID": 5,
        "index": 0,
      },
      {
        "collectionID": 5,
        "index": 1,
      },
    ],
    "tracks": [],
    "type": 0,
  };

  loadMembers(object, data, members);
  expect(object).toEqual({
    "id": 1,
    "type": 0,
    "chi2": 0.0,
    "ndf": 0,
    "dEdx": 0.0,
    "dEdxError": 0.0,
    "radiusOfInnermostHit": 17.0,
  });
});

test("load one to one relations with some definition and data", () => {
  data = {
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
      "collectionID": 2,
      "index": 2,
    },
    "tracks": [],
    "type": 0,
  };
  const oneToOneRelations = [
    {
      "type": "edm4hep::Vertex",
      "name": "startVertex",
    },
  ];
  const oneToOne = {
    "startVertex": null,
  };
  loadOneToOneRelations(object, data, oneToOneRelations, oneToOne, []);
  expect(object.oneToOneRelations).not.toBeNull();
});

test("load one to many relations with some definition and data", () => {
  data = {
    "PDG": -11,
    "charge": 1.0,
    "colorFlow": {
      "a": 0,
      "b": 0,
    },
    "daughters": [
      {
        "collectionID": 11,
        "index": 4,
      },
      {
        "collectionID": 11,
        "index": 5,
      },
    ],
    "endpoint": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0,
    },
    "generatorStatus": 21,
    "mass": 0.0,
    "momentum": {
      "x": 0.0,
      "y": 0.0,
      "z": -119.99999237060547,
    },
    "momentumAtEndpoint": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0,
    },
    "parents": [
      {
        "collectionID": 11,
        "index": 1,
      },
    ],
    "simulatorStatus": 0,
    "spin": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0,
    },
    "time": 0.0,
    "vertex": {
      "x": -0.01184066478163004,
      "y": -2.074451003863942e-6,
      "z": -0.08278788626194,
    },
  };
  const oneToManyRelations = [
    {
      "type": "edm4hep::MCParticle",
      "name": "parents",
    },
    {
      "type": "edm4hep::MCParticle",
      "name": "daughters",
    },
  ];
  const oneToMany = {
    "parents": [],
    "daughters": [],
  };
  loadOneToManyRelations(object, data, oneToManyRelations, oneToMany, []);
  expect(object.oneToManyRelations.daughters.length).toEqual(2);
  expect(object.oneToManyRelations.parents.length).toEqual(1);
});
