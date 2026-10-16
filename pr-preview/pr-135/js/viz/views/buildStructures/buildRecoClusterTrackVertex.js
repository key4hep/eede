import { emptyCopyObject } from "../../../lib/utils/copy.js";
import { getCurrentSchemaVersion } from "../../../state/globals.js";

export function buildRecoClusterTrackVertex(currentObjects, viewObjects) {
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
