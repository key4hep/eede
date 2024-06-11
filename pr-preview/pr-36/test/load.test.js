import { loadObjectType } from "../js/types/load.js";
import { datatypes } from "../output/datatypes.js";
import { objectTypes } from "../js/types/objects.js";

test("load a collection of particles", () => {
  const type = "edm4hep::Track";
  const collection = [
    {
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
          "D0": -0.05963143706321716,
          "Z0": -0.9309114217758179,
          "covMatrix": [
            0.00838407501578331, -0.0005293499561958015, 3.361300696269609e-5,
            1.1750994133308268e-7, -7.233749155233227e-9, 3.568003878462456e-11,
            0.00010174162162002176, -6.439207481889753e-6, 3.929798264579176e-9,
            0.004548509605228901, -1.0186887266172562e-5, 6.442872972911573e-7,
            -3.0552818608420296e-10, -0.00028709869366139174,
            1.831963163567707e-5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
          ],
          "location": 0,
          "omega": 0.0032351072877645493,
          "phi": -2.237527847290039,
          "referencePoint": {
            "x": 0.0,
            "y": 0.0,
            "z": 0.0,
          },
          "tanLambda": -4.997164249420166,
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
    },
    {
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
          "D0": -0.0391334593296051,
          "Z0": -0.9311737418174744,
          "covMatrix": [
            0.0035914022009819746, -0.00022589370200876147,
            1.4322121387522202e-5, 4.24616963812241e-8, -2.698678391865883e-9,
            8.189490210107342e-13, 8.363036613445729e-5, -5.291213710734155e-6,
            3.081625399303789e-9, 0.00030561615130864084, -6.513672360597411e-6,
            4.117676155601657e-7, -2.10651204812784e-10, -1.7557771570864134e-5,
            1.1170427569595631e-6, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
          ],
          "location": 0,
          "omega": -0.0019104206003248692,
          "phi": -2.798056125640869,
          "referencePoint": {
            "x": 0.0,
            "y": 0.0,
            "z": 0.0,
          },
          "tanLambda": -4.306049823760986,
          "time": 0.0,
        },
      ],
      "trackerHits": [
        {
          "collectionID": 5,
          "index": 2,
        },
        {
          "collectionID": 5,
          "index": 3,
        },
      ],
      "tracks": [],
      "type": 0,
    },
    {
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
          "D0": -0.050047606229782104,
          "Z0": -0.9527733325958252,
          "covMatrix": [
            0.007592398207634687, -0.0004792569379787892, 3.0433289794018492e-5,
            1.0142189665884871e-7, -6.283491504888161e-9,
            2.5339810111324468e-11, 0.0001311719825025648,
            -8.306328709295485e-6, 4.581083068444514e-9, 0.0035560736432671547,
            -1.2910893929074518e-5, 8.168165095412405e-7,
            -3.557094618855672e-10, -0.00022385688498616219,
            1.4287375051935669e-5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
          ],
          "location": 0,
          "omega": -0.003163003595545888,
          "phi": -2.4250643253326416,
          "referencePoint": {
            "x": 0.0,
            "y": 0.0,
            "z": 0.0,
          },
          "tanLambda": -3.454428195953369,
          "time": 0.0,
        },
      ],
      "trackerHits": [
        {
          "collectionID": 5,
          "index": 4,
        },
        {
          "collectionID": 5,
          "index": 5,
        },
      ],
      "tracks": [],
      "type": 0,
    },
  ];
  const particles = loadObjectType(
    collection,
    datatypes[type],
    objectTypes[type]
  );
  expect(particles).toEqual([
    {
      members: {
        type: 0,
        chi2: 0,
        ndf: 0,
        dEdx: 0,
        dEdxError: 0,
        radiusOfInnermostHit: 17,
      },
      id: 0,
      oneToManyRelations: {
        trackerHits: [
          {
            id: 0,
            from: 0,
            to: 0,
            collectionID: 5,
          },
          {
            id: 1,
            from: 0,
            to: 1,
            collectionID: 5,
          },
        ],
        tracks: [],
      },
    },
    {
      members: {
        type: 0,
        chi2: 0,
        ndf: 0,
        dEdx: 0,
        dEdxError: 0,
        radiusOfInnermostHit: 17,
      },
      id: 1,
      oneToManyRelations: {
        trackerHits: [
          {
            id: 1,
            from: 1,
            to: 2,
            collectionID: 5,
          },
          {
            id: 2,
            from: 1,
            to: 3,
            collectionID: 5,
          },
        ],
        tracks: [],
      },
    },
    {
      members: {
        type: 0,
        chi2: 0,
        ndf: 0,
        dEdx: 0,
        dEdxError: 0,
        radiusOfInnermostHit: 17,
      },
      id: 2,
      oneToManyRelations: {
        trackerHits: [
          {
            id: 2,
            from: 2,
            to: 4,
            collectionID: 5,
          },
          {
            id: 3,
            from: 2,
            to: 5,
            collectionID: 5,
          },
        ],
        tracks: [],
      },
    },
  ]);
});
