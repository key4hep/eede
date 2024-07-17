import { buildTree } from "./tree.js";
import { preFilterTree } from "./pre-filter.js";

export function trackTree(viewCurrentObjects) {
  const trackCollection =
    viewCurrentObjects.datatypes["edm4hep::Track"].collection ?? [];

  buildTree(trackCollection, "tracks");
}

export function preFilterTrackTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::Track", ["tracks"]);
}
