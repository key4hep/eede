import { filteredOut } from "../constants/vizStyles.js";

export function getLinkColor(link) {
  const filtered = link.from.filteredOut || link.to.filteredOut;
  return filtered ? filteredOut.linkColor : link.color;
}
