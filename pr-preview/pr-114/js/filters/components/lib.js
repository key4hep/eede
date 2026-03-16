export function addCollectionTitle(name) {
  const title = document.createElement("span");
  title.textContent = name;
  title.classList.add("filter-collection-title");
  return title;
}

export function collectionFilterContainer() {
  const container = document.createElement("div");
  container.classList.add("filter-collection-container");
  return container;
}

export function createCollectionSubtitle(name) {
  const title = document.createElement("span");
  title.textContent = name;
  title.classList.add("filter-collection-subtitle");
  return title;
}

export function createSubContainer() {
  const container = document.createElement("div");
  container.classList.add("filter-sub-container");
  return container;
}

export function createCheckboxContainer() {
  const container = document.createElement("div");
  container.classList.add("filter-checkbox-container");
  return container;
}

export function createButtonForCheckboxes(text) {
  const button = document.createElement("button");
  button.classList.add("checkbox-button");
  button.innerText = text;
  return button;
}
