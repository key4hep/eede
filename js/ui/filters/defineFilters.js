// Dynamically assign filters based on collection

export const filterDefinitions = {
  "edm4hep::MCParticle": {
    label: "MC Particle",
    filters: [
      { type: "scalarRange", property: "charge", label: "charge", unit: "e" },
      { type: "scalarRange", property: "mass", label: "mass", unit: "GeV" },
      {
        type: "scalarRange",
        property: "momentum",
        label: "momentum",
        unit: "GeV",
      },
      {
        type: "scalarRange",
        property: "vertex",
        label: "vertex",
        unit: "mm",
      },
      { type: "scalarRange", property: "time", label: "time", unit: "ns" },
      {
        type: "bitfieldCheckbox",
        property: "simulatorStatus",
        label: "Simulator Status",
      },
      {
        type: "enumCheckbox",
        property: "generatorStatus",
        label: "Generator Status",
      },
    ],
  },
  "edm4hep::ReconstructedParticle": {
    label: "Reconstructed Particle",
    filters: [
      { type: "scalarRange", property: "energy", label: "energy", unit: "GeV" },
      { type: "scalarRange", property: "charge", label: "charge", unit: "e" },
      {
        type: "magnitudeRange",
        property: "momentum",
        label: "momentum",
        unit: "GeV",
      },
    ],
  },
  "edm4hep::Cluster": {
    label: "Cluster",
    filters: [
      {
        type: "magnitudeRange",
        property: "position",
        label: "position",
        unit: "mm",
      },
      { type: "scalarRange", property: "energy", label: "energy", unit: "GeV" },
    ],
  },
  "edm4hep::Track": {
    label: "Track",
    filters: [
      { type: "scalarRange", property: "chiNdf", label: "chi^2/ndf", unit: "" },
    ],
  },
  "edm4hep::Vertex": {
    label: "Vertex",
    filters: [
      {
        type: "magnitudeRange",
        property: "position",
        label: "position",
        unit: "mm",
      },
    ],
  },
  "edm4hep::ParticleID": {
    label: "Particle ID",
    filters: [
      { type: "enumCheckbox", property: "type", label: "Type" },
      { type: "enumCheckbox", property: "PDG", label: "PDG" },
      {
        type: "enumCheckbox",
        property: "algorithmType",
        label: "Algorithm Type",
      },
    ],
  },
};
