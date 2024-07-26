import { listView } from "./templates/list.js";
import { preFilterList } from "../filters/pre-filter.js";

export function vertexList(viewCurrentObjects) {
  const vertexCollection =
    viewCurrentObjects.datatypes["edm4hep::Vertex"].collection ?? [];

  return listView(vertexCollection);
}

export function preFilterVertexList(currentObjects, viewObjects) {
  preFilterList(currentObjects, viewObjects, "edm4hep::Vertex");
}
