import { canvas } from "../main.js";
import { emptyCopyObject } from "../lib/copy.js";

export function recoClusterTrack(viewObjects) {
  const recoParticles =
    viewObjects.datatypes["edm4hep::ReconstructedParticle"].collection;

  if (recoParticles.length === 0) {
    alert("No reconstructed particles found!");
    return;
  }

  const findFirstObject = (relationName) => {
    const object = recoParticles.find((particle) => {
      const relation = particle.oneToManyRelations[relationName];
      if (relation.length > 0) {
        return relation[0].to;
      }
    });
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

  const widestObject = Math.max(clusterWidth, trackWidth);
  const widestGap = widestObject * 0.3;

  const totalHorizontalGap =
    2 * recoHorizontalGap + recoWidth + widestObject + 2 * widestGap;

  const width =
    totalHorizontalGap > window.innerWidth
      ? totalHorizontalGap
      : window.innerWidth;

  canvas.width = width;

  const recoX = width / 2 - recoWidth;

  const otherX = width / 2 + widestGap;

  let totalHeight = 0;

  recoParticles.forEach((particle) => {
    const clusterRelations = particle.oneToManyRelations["clusters"];
    const trackRelations = particle.oneToManyRelations["tracks"];

    const relationsHeight = parseInt(
      clusterRelations.length * (clusterHeight + clusterVerticalGap) +
        trackRelations.length * (trackHeight + trackVerticalGap)
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

    totalHeight += height;
  });

  canvas.height = totalHeight;
}

export function preFilterRecoClusterTrack(currentObjects, viewObjects) {
  emptyCopyObject(currentObjects, viewObjects);

  const fromDatatype =
    currentObjects.datatypes["edm4hep::ReconstructedParticle"];

  const fromCollection = fromDatatype.collection;

  const recoParticles = [];
  const clusters = [];
  const tracks = [];

  fromCollection.forEach((particle) => {
    const clusterRelations = particle.oneToManyRelations["clusters"];
    const trackRelations = particle.oneToManyRelations["tracks"];

    const total = clusterRelations.length + trackRelations.length;

    if (total === 0) {
      return;
    }

    clusterRelations.forEach((clusterRelation) => {
      const cluster = clusterRelation.to;
      clusters.push(cluster);
    });

    trackRelations.forEach((trackRelation) => {
      const track = trackRelation.to;
      tracks.push(track);
    });

    recoParticles.push(particle);
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

  viewObjects.datatypes["edm4hep::Cluster"].collection = clusters;

  viewObjects.datatypes["edm4hep::Track"].collection = tracks;
}
