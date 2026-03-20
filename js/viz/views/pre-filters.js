import {
  preFilterTree,
  preFilterAssociation,
  preFilterList,
  preFilterOneWay,
} from "../../ui/filters/pre-filter.js";
import { emptyCopyObject } from "../../lib/copy.js";
import { getCurrentSchemaVersion, schemaWithLinks } from "../../state/globals.js";

export function preFilterMCTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::MCParticle", [
    "parents",
    "daughters",
  ]);
}

export function preFilterRecoTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::ReconstructedParticle", [
    "particles",
  ]);
}

export function preFilterTrackTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::Track", ["tracks"]);
}

export function preFilterClusterTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::Cluster", ["clusters"]);
}

export function preFilterRecoClusterTrackVertex(currentObjects, viewObjects) {
  emptyCopyObject(currentObjects, viewObjects);

  const fromDatatype =
    currentObjects.datatypes["edm4hep::ReconstructedParticle"];

  const fromCollection = fromDatatype.collection;

  const added = new Set();

  const recoParticles = [];
  const clusters = [];
  const tracks = [];
  const vertexCollection = [];

  const vertexRelStr =
    getCurrentSchemaVersion() < 2 ? "startVertex" : "decayVertex";

  fromCollection.forEach((particle) => {
    const id = `${particle.index}-${particle.collectionId}`;

    const clusterRelations = particle.oneToManyRelations["clusters"];
    const trackRelations = particle.oneToManyRelations["tracks"];
    const vertexRelation = particle.oneToOneRelations[vertexRelStr];

    const total =
      clusterRelations.length +
      trackRelations.length +
      (vertexRelation !== undefined ? 1 : 0);

    if (total === 0) {
      return;
    }

    clusterRelations.forEach((clusterRelation) => {
      const cluster = clusterRelation.to;
      const clusterId = `${cluster.index}-${cluster.collectionId}`;

      if (!added.has(clusterId)) {
        added.add(clusterId);
        clusters.push(cluster);
      }
    });

    trackRelations.forEach((trackRelation) => {
      const track = trackRelation.to;
      const trackId = `${track.index}-${track.collectionId}`;

      if (!added.has(trackId)) {
        added.add(trackId);
        tracks.push(track);
      }
    });

    if (vertexRelation !== undefined) {
      const vertex = vertexRelation.to;
      const vertexId = `${vertex.index}-${vertex.collectionId}`;

      if (!added.has(vertexId)) {
        added.add(vertexId);
        vertexCollection.push(vertex);
      }
    }

    if (!added.has(id)) {
      added.add(id);
      recoParticles.push(particle);
    }
  });

  viewObjects.datatypes["edm4hep::ReconstructedParticle"].collection =
    recoParticles;
  viewObjects.datatypes["edm4hep::ReconstructedParticle"].oneToMany[
    "clusters"
  ] =
    currentObjects.datatypes["edm4hep::ReconstructedParticle"].oneToMany[
      "clusters"
    ];
  viewObjects.datatypes["edm4hep::ReconstructedParticle"].oneToMany["tracks"] =
    currentObjects.datatypes["edm4hep::ReconstructedParticle"].oneToMany[
      "tracks"
    ];
  viewObjects.datatypes["edm4hep::ReconstructedParticle"].oneToOne[
    vertexRelStr
  ] =
    currentObjects.datatypes["edm4hep::ReconstructedParticle"].oneToOne[
      vertexRelStr
    ];

  viewObjects.datatypes["edm4hep::Cluster"].collection = clusters;
  viewObjects.datatypes["edm4hep::Track"].collection = tracks;
  viewObjects.datatypes["edm4hep::Vertex"].collection = vertexCollection;
}

export function preFilterMCReco(currentVisObjects, viewObjects) {
  let linkCollTypeName =
    "podio::LinkCollection<edm4hep::ReconstructedParticle,edm4hep::MCParticle>";
  if (!schemaWithLinks()) {
    linkCollTypeName = "edm4hep::MCRecoParticleAssociation";
  }
  preFilterAssociation(
    currentVisObjects,
    viewObjects,
    linkCollTypeName,
    "edm4hep::ReconstructedParticle",
    "edm4hep::MCParticle",
  );
}

export function preFilterMCTrack(currentObjects, viewObjects) {
  preFilterAssociation(
    currentObjects,
    viewObjects,
    "edm4hep::MCRecoTrackParticleAssociation",
    "edm4hep::Track",
    "edm4hep::MCParticle",
  );
}

export function preFilterMCCluster(currentObjects, viewObjects) {
  preFilterAssociation(
    currentObjects,
    viewObjects,
    "edm4hep::MCRecoClusterParticleAssociation",
    "edm4hep::Cluster",
    "edm4hep::MCParticle",
  );
}

export function preFilterVertexList(currentObjects, viewObjects) {
  preFilterList(currentObjects, viewObjects, "edm4hep::Vertex");
}

export function preFilterParticleIDList(currentObjects, viewObjects) {
  preFilterList(currentObjects, viewObjects, "edm4hep::ParticleID");
}

export function preFilterRecoParticleID(currentObjects, viewObjects) {
  preFilterOneWay(
    currentObjects,
    viewObjects,
    "particle",
    "edm4hep::ParticleID",
    "edm4hep::ReconstructedParticle",
  );
}
