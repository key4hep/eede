export const datatypes = {
  "edm4hep::MCParticle": {
    "members": [
      {
        "type": "int32_t",
        "name": "PDG"
      },
      {
        "type": "int32_t",
        "name": "generatorStatus"
      },
      {
        "type": "int32_t",
        "name": "simulatorStatus"
      },
      {
        "type": "float",
        "name": "charge"
      },
      {
        "type": "float",
        "name": "time",
        "unit": "ns"
      },
      {
        "type": "double",
        "name": "mass",
        "unit": "GeV"
      },
      {
        "type": "edm4hep::Vector3d",
        "name": "vertex",
        "unit": "mm"
      },
      {
        "type": "edm4hep::Vector3d",
        "name": "endpoint",
        "unit": "mm"
      },
      {
        "type": "edm4hep::Vector3d",
        "name": "momentum",
        "unit": "GeV"
      },
      {
        "type": "edm4hep::Vector3d",
        "name": "momentumAtEndpoint",
        "unit": "GeV"
      },
      {
        "type": "edm4hep::Vector3f",
        "name": "spin"
      },
      {
        "type": "edm4hep::Vector2i",
        "name": "colorFlow"
      }
    ],
    "oneToManyRelations": [
      {
        "type": [
          "edm4hep::MCParticle",
          "parents"
        ]
      },
      {
        "type": [
          "edm4hep::MCParticle",
          "daughters"
        ]
      }
    ]
  },
  "edm4hep::ParticleID": {
    "members": [
      {
        "type": "int32_t",
        "name": "type"
      },
      {
        "type": "int32_t",
        "name": "PDG"
      },
      {
        "type": "int32_t",
        "name": "algorithmType"
      },
      {
        "type": "float",
        "name": "likelihood"
      }
    ],
    "oneToOneRelations": [
      {
        "type": [
          "edm4hep::ReconstructedParticle",
          "particle"
        ]
      }
    ]
  },
  "edm4hep::Cluster": {
    "members": [
      {
        "type": "int32_t",
        "name": "type"
      },
      {
        "type": "float",
        "name": "energy",
        "unit": "GeV"
      },
      {
        "type": "float",
        "name": "energyError",
        "unit": "GeV"
      },
      {
        "type": "edm4hep::Vector3f",
        "name": "position",
        "unit": "mm"
      },
      {
        "type": "edm4hep::CovMatrix3f",
        "name": "positionError"
      },
      {
        "type": "float",
        "name": "iTheta"
      },
      {
        "type": "float",
        "name": "phi"
      },
      {
        "type": "edm4hep::Vector3f",
        "name": "directionError",
        "unit": "mm**2"
      }
    ],
    "oneToManyRelations": [
      {
        "type": [
          "edm4hep::Cluster",
          "clusters"
        ]
      },
      {
        "type": [
          "edm4hep::CalorimeterHit",
          "hits"
        ]
      }
    ]
  },
  "edm4hep::Track": {
    "members": [
      {
        "type": "int32_t",
        "name": "type"
      },
      {
        "type": "float",
        "name": "chi2"
      },
      {
        "type": "int32_t",
        "name": "ndf"
      },
      {
        "type": "float",
        "name": "dEdx"
      },
      {
        "type": "float",
        "name": "dEdxError"
      },
      {
        "type": "float",
        "name": "radiusOfInnermostHit"
      }
    ],
    "oneToManyRelations": [
      {
        "type": [
          "edm4hep::TrackerHit",
          "trackerHits"
        ]
      },
      {
        "type": [
          "edm4hep::Track",
          "tracks"
        ]
      }
    ]
  },
  "edm4hep::Vertex": {
    "members": [
      {
        "type": "int32_t",
        "name": "primary"
      },
      {
        "type": "float",
        "name": "chi2"
      },
      {
        "type": "float",
        "name": "probability"
      },
      {
        "type": "edm4hep::Vector3f",
        "name": "position"
      },
      {
        "type": "edm4hep::CovMatrix3f",
        "name": "covMatrix"
      },
      {
        "type": "int32_t",
        "name": "algorithmType"
      }
    ],
    "oneToOneRelations": [
      {
        "type": [
          "edm4hep::ReconstructedParticle",
          "associatedParticle"
        ]
      }
    ]
  },
  "edm4hep::ReconstructedParticle": {
    "members": [
      {
        "type": "int32_t",
        "name": "PDG"
      },
      {
        "type": "float",
        "name": "energy",
        "unit": "GeV"
      },
      {
        "type": "edm4hep::Vector3f",
        "name": "momentum",
        "unit": "GeV"
      },
      {
        "type": "edm4hep::Vector3f",
        "name": "referencePoint",
        "unit": "mm"
      },
      {
        "type": "float",
        "name": "charge"
      },
      {
        "type": "float",
        "name": "mass",
        "unit": "GeV"
      },
      {
        "type": "float",
        "name": "goodnessOfPID"
      },
      {
        "type": "edm4hep::CovMatrix4f",
        "name": "covMatrix"
      }
    ],
    "oneToManyRelations": [
      {
        "type": [
          "edm4hep::Cluster",
          "clusters"
        ]
      },
      {
        "type": [
          "edm4hep::Track",
          "tracks"
        ]
      },
      {
        "type": [
          "edm4hep::ReconstructedParticle",
          "particles"
        ]
      }
    ],
    "oneToOneRelations": [
      {
        "type": [
          "edm4hep::Vertex",
          "startVertex"
        ]
      }
    ]
  }
}