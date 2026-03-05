import { buildTree } from "./templates/tree.js";
import { preFilterTree } from "../filters/pre-filter.js";

export function trackTree(viewCurrentObjects) {
  const trackCollection =
    viewCurrentObjects.datatypes["edm4hep::Track"].collection ?? [];

  return buildTree(trackCollection, "tracks");
}

export function preFilterTrackTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::Track", ["tracks"]);
}
