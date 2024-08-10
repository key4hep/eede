import { emptyCopyObject } from "../../lib/copy.js";

export function recoClusterTrackVertex(viewObjects) {
  const recoParticles =
    viewObjects.datatypes["edm4hep::ReconstructedParticle"].collection;

  if (recoParticles.length === 0) {
    return [0, 0];
  }

  const findFirstObject = (relationName) => {
    const object = recoParticles.find((particle) => {
      const relation = particle.oneToManyRelations[relationName];
      if (relation.length > 0) {
        return relation[0].to;
      }
    });

    if (!object) {
      return { width: 0, height: 0 };
    }
    return object;
  };

  const firstRecoParticle = recoParticles[0];
  const recoHeight = firstRecoParticle.height;
  const recoVerticalGap = parseInt(recoHeight * 0.3);
  const recoVerticalSpace = recoHeight + recoVerticalGap;
  const recoHalfHeight = parseInt(recoHeight / 2);
  const recoWidth = firstRecoParticle.width;
  const recoHorizontalGap = recoWidth * 0.3;

  const firstCluster = findFirstObject("clusters");
  const clusterHeight = firstCluster.height;
  const clusterVerticalGap = clusterHeight * 0.3;
  const clusterWidth = firstCluster.width;
  const firstTrack = findFirstObject("tracks");
  const trackHeight = firstTrack.height;
  const trackVerticalGap = trackHeight * 0.3;
  const trackWidth = firstTrack.width;

  const firstVertex = recoParticles.find((particle) => {
    const vertexRelation = particle.oneToOneRelations["startVertex"];
    if (vertexRelation !== undefined) {
      return vertexRelation.to;
    }
  });

  let vertexHeight = 0;
  let vertexVerticalGap = 0;
  let vertexWidth = 0;
  if (firstVertex !== undefined) {
    vertexHeight = firstVertex.height;
    vertexVerticalGap = vertexHeight * 0.3;
    vertexWidth = firstVertex.width;
  }

  const widestObject = Math.max(clusterWidth, trackWidth, vertexWidth);
  const widestGap = widestObject * 0.3;

  const totalHorizontalGap =
    2 * recoHorizontalGap + recoWidth + widestObject + 2 * widestGap;

  const width =
    totalHorizontalGap > window.innerWidth
      ? totalHorizontalGap
      : window.innerWidth;

  const recoX = width / 2 - recoWidth;

  const otherX = width / 2 + widestGap;

  let totalHeight = 0;

  recoParticles.forEach((particle) => {
    const clusterRelations = particle.oneToManyRelations["clusters"];
    const trackRelations = particle.oneToManyRelations["tracks"];
    const vertexRelation = particle.oneToOneRelations["startVertex"];

    const relationsHeight = parseInt(
      clusterRelations.length * (clusterHeight + clusterVerticalGap) +
        trackRelations.length * (trackHeight + trackVerticalGap) +
        (vertexRelation !== undefined ? vertexHeight + vertexVerticalGap : 0)
    );

    const height =
      recoVerticalSpace > relationsHeight ? recoVerticalSpace : relationsHeight;

    const recoY = totalHeight + height / 2 - recoHalfHeight;
    particle.y = recoY;
    particle.x = recoX;

    const initialGap = (height - relationsHeight) / 2;

    let accumulatedRelationsHeight = initialGap + totalHeight;

    clusterRelations.forEach((clusterRelation) => {
      const cluster = clusterRelation.to;
      cluster.x = otherX;

      const y = clusterVerticalGap / 2 + accumulatedRelationsHeight;
      cluster.y = y;
      accumulatedRelationsHeight += clusterHeight + clusterVerticalGap / 2;
    });

    trackRelations.forEach((trackRelation) => {
      const track = trackRelation.to;
      track.x = otherX;

      const y = trackVerticalGap / 2 + accumulatedRelationsHeight;
      track.y = y;
      accumulatedRelationsHeight += trackHeight + trackVerticalGap / 2;
    });

    if (vertexRelation !== undefined) {
      const vertex = vertexRelation.to;
      vertex.x = otherX;

      const y = vertexVerticalGap / 2 + accumulatedRelationsHeight;
      vertex.y = y;
      accumulatedRelationsHeight += vertexHeight + vertexVerticalGap / 2;
    }

    totalHeight += height;
  });

  return [width, totalHeight];
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

  fromCollection.forEach((particle) => {
    const id = `${particle.index}-${particle.collectionId}`;

    const clusterRelations = particle.oneToManyRelations["clusters"];
    const trackRelations = particle.oneToManyRelations["tracks"];
    const vertexRelation = particle.oneToOneRelations["startVertex"];

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
    "startVertex"
  ] =
    currentObjects.datatypes["edm4hep::ReconstructedParticle"].oneToOne[
      "startVertex"
    ];

  viewObjects.datatypes["edm4hep::Cluster"].collection = clusters;
  viewObjects.datatypes["edm4hep::Track"].collection = tracks;
  viewObjects.datatypes["edm4hep::Vertex"].collection = vertexCollection;
}
