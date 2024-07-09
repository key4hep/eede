import { buildTree } from "./tree.js";
import { preFilterTree } from "./pre-filter.js";

export function trackTree(viewCurrentObjects) {
  const trackCollection =
    viewCurrentObjects.datatypes["edm4hep::Track"].collection ?? [];

  if (trackCollection.length === 0) {
    alert("No Tracks found in this event.");
    return;
  }

  buildTree(trackCollection, "tracks");
}

export function preFilterTrackTree(currentObjects, viewObjects) {
  preFilterTree(currentObjects, viewObjects, "edm4hep::Track", ["tracks"]);
}
