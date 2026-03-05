export const supportedEDM4hepTypes = {
  "1": {
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
          "name": "time"
        },
        {
          "name": "mass"
        },
        {
          "name": "vertex"
        },
        {
          "name": "endpoint"
        },
        {
          "name": "momentum"
        },
        {
          "name": "momentumAtEndpoint"
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
      ]
    },
    "edm4hep::Cluster": {
      "members": [
        {
          "name": "type"
        },
        {
          "name": "energy"
        },
        {
          "name": "energyError"
        },
        {
          "name": "position"
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
          "name": "directionError"
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
        },
        {
          "type": "edm4hep::ParticleID",
          "name": "particleIDs"
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
          "type": "edm4hep::ReconstructedParticle",
          "name": "associatedParticle"
        }
      ]
    },
    "edm4hep::ReconstructedParticle": {
      "members": [
        {
          "name": "type"
        },
        {
          "name": "energy"
        },
        {
          "name": "momentum"
        },
        {
          "name": "referencePoint"
        },
        {
          "name": "charge"
        },
        {
          "name": "mass"
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
        },
        {
          "type": "edm4hep::ParticleID",
          "name": "particleIDs"
        }
      ],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Vertex",
          "name": "startVertex"
        },
        {
          "type": "edm4hep::ParticleID",
          "name": "particleIDUsed"
        }
      ]
    },
    "edm4hep::MCRecoParticleAssociation": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToOneRelations": [
        {
          "type": "edm4hep::ReconstructedParticle",
          "name": "rec"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "sim"
        }
      ]
    },
    "edm4hep::MCRecoClusterParticleAssociation": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Cluster",
          "name": "rec"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "sim"
        }
      ]
    },
    "edm4hep::MCRecoTrackParticleAssociation": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Track",
          "name": "rec"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "sim"
        }
      ]
    }
  },
  "2": {
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
          "name": "Nholes"
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
          "name": "type"
        },
        {
          "name": "chi2"
        },
        {
          "name": "ndf"
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
      "oneToManyRelations": [
        {
          "type": "edm4hep::ReconstructedParticle",
          "name": "particles"
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
          "name": "decayVertex"
        }
      ]
    }
  },
  "3": {
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
          "name": "charge",
          "unit": "e"
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
          "name": "position",
          "unit": "mm"
        },
        {
          "name": "positionError",
          "unit": "mm^2"
        },
        {
          "name": "iTheta",
          "unit": "rad"
        },
        {
          "name": "phi",
          "unit": "rad"
        },
        {
          "name": "directionError",
          "unit": "mm^2"
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
          "name": "Nholes"
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
          "name": "type"
        },
        {
          "name": "chi2"
        },
        {
          "name": "ndf"
        },
        {
          "name": "position",
          "unit": "mm"
        },
        {
          "name": "covMatrix",
          "unit": "mm^2"
        },
        {
          "name": "algorithmType"
        }
      ],
      "oneToManyRelations": [
        {
          "type": "edm4hep::ReconstructedParticle",
          "name": "particles"
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
          "name": "charge",
          "unit": "e"
        },
        {
          "name": "mass",
          "unit": "GeV"
        },
        {
          "name": "goodnessOfPID"
        },
        {
          "name": "covMatrix",
          "unit": "GeV^2"
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
          "name": "decayVertex"
        }
      ]
    },
    "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToManyRelations": [],
      "oneToOneRelations": [
        {
          "type": "edm4hep::ReconstructedParticle",
          "name": "from"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "to"
        }
      ]
    },
    "podio::LinkCollection<edm4hep::Cluster,edm4hep::MCParticle>": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToManyRelations": [],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Cluster",
          "name": "from"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "to"
        }
      ]
    },
    "podio::LinkCollection<edm4hep::Track,edm4hep::MCParticle>": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToManyRelations": [],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Track",
          "name": "from"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "to"
        }
      ]
    }
  },
  "4": {
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
          "name": "charge",
          "unit": "e"
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
          "name": "position",
          "unit": "mm"
        },
        {
          "name": "positionError",
          "unit": "mm^2"
        },
        {
          "name": "iTheta",
          "unit": "rad"
        },
        {
          "name": "phi",
          "unit": "rad"
        },
        {
          "name": "directionError",
          "unit": "mm^2"
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
          "name": "Nholes"
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
          "name": "type"
        },
        {
          "name": "chi2"
        },
        {
          "name": "ndf"
        },
        {
          "name": "position",
          "unit": "mm"
        },
        {
          "name": "covMatrix",
          "unit": "mm^2"
        },
        {
          "name": "algorithmType"
        }
      ],
      "oneToManyRelations": [
        {
          "type": "edm4hep::ReconstructedParticle",
          "name": "particles"
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
          "name": "charge",
          "unit": "e"
        },
        {
          "name": "mass",
          "unit": "GeV"
        },
        {
          "name": "goodnessOfPID"
        },
        {
          "name": "covMatrix",
          "unit": "GeV^2"
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
          "name": "decayVertex"
        }
      ]
    },
    "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToManyRelations": [],
      "oneToOneRelations": [
        {
          "type": "edm4hep::ReconstructedParticle",
          "name": "from"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "to"
        }
      ]
    },
    "podio::LinkCollection<edm4hep::Cluster,edm4hep::MCParticle>": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToManyRelations": [],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Cluster",
          "name": "from"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "to"
        }
      ]
    },
    "podio::LinkCollection<edm4hep::Track,edm4hep::MCParticle>": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToManyRelations": [],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Track",
          "name": "from"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "to"
        }
      ]
    }
  },
  "old": {
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
          "name": "time"
        },
        {
          "name": "mass"
        },
        {
          "name": "vertex"
        },
        {
          "name": "endpoint"
        },
        {
          "name": "momentum"
        },
        {
          "name": "momentumAtEndpoint"
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
      ]
    },
    "edm4hep::Cluster": {
      "members": [
        {
          "name": "type"
        },
        {
          "name": "energy"
        },
        {
          "name": "energyError"
        },
        {
          "name": "position"
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
          "name": "directionError"
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
        },
        {
          "type": "edm4hep::ParticleID",
          "name": "particleIDs"
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
          "type": "edm4hep::ReconstructedParticle",
          "name": "associatedParticle"
        }
      ]
    },
    "edm4hep::ReconstructedParticle": {
      "members": [
        {
          "name": "type"
        },
        {
          "name": "energy"
        },
        {
          "name": "momentum"
        },
        {
          "name": "referencePoint"
        },
        {
          "name": "charge"
        },
        {
          "name": "mass"
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
        },
        {
          "type": "edm4hep::ParticleID",
          "name": "particleIDs"
        }
      ],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Vertex",
          "name": "startVertex"
        },
        {
          "type": "edm4hep::ParticleID",
          "name": "particleIDUsed"
        }
      ]
    },
    "edm4hep::MCRecoParticleAssociation": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToOneRelations": [
        {
          "type": "edm4hep::ReconstructedParticle",
          "name": "rec"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "sim"
        }
      ]
    },
    "edm4hep::MCRecoClusterParticleAssociation": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Cluster",
          "name": "rec"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "sim"
        }
      ]
    },
    "edm4hep::MCRecoTrackParticleAssociation": {
      "members": [
        {
          "name": "weight"
        }
      ],
      "oneToOneRelations": [
        {
          "type": "edm4hep::Track",
          "name": "rec"
        },
        {
          "type": "edm4hep::MCParticle",
          "name": "sim"
        }
      ]
    }
  }
};