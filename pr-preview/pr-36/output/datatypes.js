export const datatypes = {
  "edm4hep::MCParticle": {
    "members": [
      {
        "name": "PDG"
      },
      {
        "name": "generatorStatus"
      },
      {
        "name": "simulatorStatus"
      },
      {
        "name": "charge"
      },
      {
        "name": "time",
        "unit": "ns"
      },
      {
        "name": "mass",
        "unit": "GeV"
      },
      {
        "name": "vertex",
        "unit": "mm"
      },
      {
        "name": "endpoint",
        "unit": "mm"
      },
      {
        "name": "momentum",
        "unit": "GeV"
      },
      {
        "name": "momentumAtEndpoint",
        "unit": "GeV"
      },
      {
        "name": "spin"
      },
      {
        "name": "colorFlow"
      }
    ],
    "oneToManyRelations": [
      {
        "name": "parents"
      },
      {
        "name": "daughters"
      }
    ]
  },
  "edm4hep::ParticleID": {
    "members": [
      {
        "name": "type"
      },
      {
        "name": "PDG"
      },
      {
        "name": "algorithmType"
      },
      {
        "name": "likelihood"
      }
    ],
    "oneToOneRelations": [
      {
        "name": "particle"
      }
    ]
  },
  "edm4hep::Cluster": {
    "members": [
      {
        "name": "type"
      },
      {
        "name": "energy",
        "unit": "GeV"
      },
      {
        "name": "energyError",
        "unit": "GeV"
      },
      {
        "name": "position",
        "unit": "mm"
      },
      {
        "name": "positionError"
      },
      {
        "name": "iTheta"
      },
      {
        "name": "phi"
      },
      {
        "name": "directionError",
        "unit": "mm**2"
      }
    ],
    "oneToManyRelations": [
      {
        "name": "clusters"
      },
      {
        "name": "hits"
      }
    ]
  },
  "edm4hep::Track": {
    "members": [
      {
        "name": "type"
      },
      {
        "name": "chi2"
      },
      {
        "name": "ndf"
      },
      {
        "name": "dEdx"
      },
      {
        "name": "dEdxError"
      },
      {
        "name": "radiusOfInnermostHit"
      }
    ],
    "oneToManyRelations": [
      {
        "name": "trackerHits"
      },
      {
        "name": "tracks"
      }
    ]
  },
  "edm4hep::Vertex": {
    "members": [
      {
        "name": "primary"
      },
      {
        "name": "chi2"
      },
      {
        "name": "probability"
      },
      {
        "name": "position"
      },
      {
        "name": "covMatrix"
      },
      {
        "name": "algorithmType"
      }
    ],
    "oneToOneRelations": [
      {
        "name": "associatedParticle"
      }
    ]
  },
  "edm4hep::ReconstructedParticle": {
    "members": [
      {
        "name": "PDG"
      },
      {
        "name": "energy",
        "unit": "GeV"
      },
      {
        "name": "momentum",
        "unit": "GeV"
      },
      {
        "name": "referencePoint",
        "unit": "mm"
      },
      {
        "name": "charge"
      },
      {
        "name": "mass",
        "unit": "GeV"
      },
      {
        "name": "goodnessOfPID"
      },
      {
        "name": "covMatrix"
      }
    ],
    "oneToManyRelations": [
      {
        "name": "clusters"
      },
      {
        "name": "tracks"
      },
      {
        "name": "particles"
      }
    ],
    "oneToOneRelations": [
      {
        "name": "startVertex"
      }
    ]
  }
}