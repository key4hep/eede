import { buildTree } from "./tree.js";
import { preFilterTree } from "./pre-filter.js";

export function clusterTree(viewCurrentObjects) {
  const clusterCollection =
    viewCurrentObjects.datatypes["edm4hep::Cluster"].collection ?? [];

  if (clusterCollection.length === 0) {
    alert("No Clusters found in this event.");
    return;
  }

  buildTree(clusterCollection, "clusters");
}

export function preFilterClusterTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::Cluster", ["clusters"]);
}
