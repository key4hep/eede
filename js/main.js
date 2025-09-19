// Clear all possible stored state
window.sessionStorage.clear();

export function showEventSwitcher() {
  const eventSwitcher = document.getElementById("event-switcher");

  eventSwitcher.style.display = "flex";
}

export function showViewsMenu() {
  const viewsMenu = document.getElementById("left-menu");
  const aboutButton = document.getElementById("information-button");

  viewsMenu.style.display = "flex";
  aboutButton.style.display = "block";
}

export function showFilters() {
  const filters = document.getElementById("filters");

  filters.style.display = "block";
}
