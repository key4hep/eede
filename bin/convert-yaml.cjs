const { argv } = require('node:process');
const fs = require('node:fs');
const jsYaml = require('js-yaml');

const inFilePath = argv[2] ?? "model/edm4hep.yaml";
const outFilePath = argv[3] ?? "model/datatypes.json";

const inFileData = fs.readFileSync(inFilePath, "utf-8");
const edm4hepDefinitions = jsYaml.load(inFileData);

const datatypes = edm4hepDefinitions.datatypes;
const linktypes = edm4hepDefinitions.links;
const schemaVersion = edm4hepDefinitions.schema_version;


if (schemaVersion < 3) {
  console.warn("The schema version too old, edit the datatypes.json file manually!");
  return;
}


const supportedTypes = {
  "old": [
    "edm4hep::Cluster",
    "edm4hep::ParticleID",
    "edm4hep::MCParticle",
    "edm4hep::Vertex",
    "edm4hep::ReconstructedParticle",
    "edm4hep::Track",
    "edm4hep::MCRecoParticleAssociation",
    "edm4hep::MCRecoTrackParticleAssociation",
    "edm4hep::MCRecoClusterParticleAssociation",
  ],
  "1": [
    "edm4hep::Cluster",
    "edm4hep::ParticleID",
    "edm4hep::MCParticle",
    "edm4hep::Vertex",
    "edm4hep::ReconstructedParticle",
    "edm4hep::Track",
    "edm4hep::MCRecoParticleAssociation",
    "edm4hep::MCRecoTrackParticleAssociation",
    "edm4hep::MCRecoClusterParticleAssociation",
  ],
  "2": [
    "edm4hep::Cluster",
    "edm4hep::ParticleID",
    "edm4hep::MCParticle",
    "edm4hep::Vertex",
    "edm4hep::ReconstructedParticle",
    "edm4hep::Track",
    // TODO: make Links work
    // "edm4hep::RecoMCParticleLink",
    // "edm4hep::TrackMCParticleLink",
    // "edm4hep::ClusterMCParticleLink",
  ],
  "3": [
    "edm4hep::Cluster",
    "edm4hep::ParticleID",
    "edm4hep::MCParticle",
    "edm4hep::Vertex",
    "edm4hep::ReconstructedParticle",
    "edm4hep::Track",
    "edm4hep::RecoMCParticleLink",
    "edm4hep::TrackMCParticleLink",
    "edm4hep::ClusterMCParticleLink",
  ],
  "4": [
    "edm4hep::Cluster",
    "edm4hep::ParticleID",
    "edm4hep::MCParticle",
    "edm4hep::Vertex",
    "edm4hep::ReconstructedParticle",
    "edm4hep::Track",
    "edm4hep::RecoMCParticleLink",
    "edm4hep::TrackMCParticleLink",
    "edm4hep::ClusterMCParticleLink",
  ],
}


const selectedTypes = Object.entries(datatypes).filter(([typeName,]) =>
  supportedTypes[schemaVersion].includes(typeName)
);

const selectedLinkTypes = Object.entries(linktypes).filter(([typeName,]) =>
  supportedTypes[schemaVersion].includes(typeName)
);

const datatypesDefinition = {};

class DataTypeMember {
  constructor(name, unit = null) {
    this.name = name;
    if (unit) this.unit = unit;
  }
}

class Relation {
  constructor(type, name) {
    this.type = type;
    this.name = name;
  }
}

const parseString = (string) => {
  return string
    .split("//")[0]
    .trim()
    .split(" ")
    .filter((substring) => substring !== "");
};

const parseDatatypesMembers = (members) => {
  const newMembers = [];

  for (const member of members) {
    let [, name, unit] = parseString(member);
    if (unit) unit = unit.replace("[", "").replace("]", "");
    newMembers.push(new DataTypeMember(name, unit));
  }

  return newMembers;
};

const parseRelation = (relations) => {
  return relations.map((relation) => {
    const [type, name] = parseString(relation);

    return new Relation(type, name);
  });
};

selectedTypes.forEach(([name, values]) => {
  const members = values["Members"] ?? false;
  let parsedMembers;
  if (members) parsedMembers = parseDatatypesMembers(members);
  const oneToManyRelations = values["OneToManyRelations"] ?? false;
  let parsedOneToManyRelations;
  if (oneToManyRelations)
    parsedOneToManyRelations = parseRelation(oneToManyRelations);
  const oneToOneRelations = values["OneToOneRelations"] ?? false;
  let parsedOneToOneRelations;
  if (oneToOneRelations)
    parsedOneToOneRelations = parseRelation(oneToOneRelations);

  datatypesDefinition[name] = {
    members: parsedMembers,
    oneToManyRelations: parsedOneToManyRelations,
    oneToOneRelations: parsedOneToOneRelations,
  };
});

selectedLinkTypes.forEach(([, typeObj]) => {
  const members = [
    {"name": "weight"}
  ];
  const oneToOneRelations = [
    {
      "type": typeObj.From,
      "name": "from"
    },
    {
      "type": typeObj.To,
      "name": "to"
    }
  ];
  const typeName = `podio::LinkCollection<${typeObj.From},${typeObj.To}>`;
  datatypesDefinition[typeName] = {
   members: members,
    oneToManyRelations: [],
    oneToOneRelations: oneToOneRelations
  };
});

// Replace/Update datatypes for the found schema version
try {
  var datatypesAll = JSON.parse(fs.readFileSync(outFilePath, 'utf8'));
} catch {
  datatypesAll = {};
}
if (schemaVersion in datatypesAll) {
  console.log('Warning: Overwriting datatypes for existing schema!')
  console.log(`          - schemaVersion: ${schemaVersion}`);
}

datatypesAll[schemaVersion] = datatypesDefinition;

fs.writeFileSync(outFilePath, JSON.stringify(datatypesAll, null, 2));
console.log('Info: Updated datatypes has been writen to:')
console.log(`       - filePath: ${outFilePath}`)
console.log(`       - schemaVersion: ${schemaVersion}`);
