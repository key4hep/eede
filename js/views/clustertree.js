import { buildTree } from "./templates/tree.js";
import { preFilterTree } from "../filters/pre-filter.js";

export function clusterTree(viewCurrentObjects) {
  const clusterCollection =
    viewCurrentObjects.datatypes["edm4hep::Cluster"].collection ?? [];

  return buildTree(clusterCollection, "clusters");
}

export function preFilterClusterTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::Cluster", ["clusters"]);
}
