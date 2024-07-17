export function setupNoFilter() {
  const manipulationTools =
    document.getElementsByClassName("manipulation-tool");
  for (const tool of manipulationTools) {
    tool.style.display = "none";
  }
}
