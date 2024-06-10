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
        "type": "edm4hep::MCParticle",
        "name": "parents"
      },
      {
        "type": "edm4hep::MCParticle",
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
        "type": "edm4hep::ReconstructedParticle",
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
        "type": "edm4hep::Vector3f",
        "name": "position",
        "unit": "mm"
      },
      {
        "type": "edm4hep::CovMatrix3f",
        "name": "positionError"
      },
      {
        "name": "iTheta"
      },
      {
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
        "type": "edm4hep::Cluster",
        "name": "clusters"
      },
      {
        "type": "edm4hep::CalorimeterHit",
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
        "type": "edm4hep::TrackerHit",
        "name": "trackerHits"
      },
      {
        "type": "edm4hep::Track",
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
        "type": "edm4hep::Vector3f",
        "name": "position"
      },
      {
        "type": "edm4hep::CovMatrix3f",
        "name": "covMatrix"
      },
      {
        "name": "algorithmType"
      }
    ],
    "oneToOneRelations": [
      {
        "type": "edm4hep::ReconstructedParticle",
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
        "type": "edm4hep::CovMatrix4f",
        "name": "covMatrix"
      }
    ],
    "oneToManyRelations": [
      {
        "type": "edm4hep::Cluster",
        "name": "clusters"
      },
      {
        "type": "edm4hep::Track",
        "name": "tracks"
      },
      {
        "type": "edm4hep::ReconstructedParticle",
        "name": "particles"
      }
    ],
    "oneToOneRelations": [
      {
        "type": "edm4hep::Vertex",
        "name": "startVertex"
      }
    ]
  }
}