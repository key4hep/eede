import { listView } from "./list.js";
import { preFilterList } from "./pre-filter.js";

export function vertexList(viewCurrentObjects) {
  const vertexCollection =
    viewCurrentObjects.datatypes["edm4hep::Vertex"].collection ?? [];

  listView(vertexCollection);
}

export function preFilterVertexList(currentObjects, viewObjects) {
  preFilterList(currentObjects, viewObjects, "edm4hep::Vertex");
}
