// Handles input modal visibility

export function hideInputModal() {
  document.getElementById("input-modal").style.display = "none";
}

export function showInputModal() {
  document.getElementById("input-modal").style.display = "block";
}

export function hideInputModalCloseButton() {
  document.getElementById("input-modal-close-button").style.display = "none";
}

export function showInputModalCloseButton() {
  document.getElementById("input-modal-close-button").style.display = "block";
}

export function clearInputModal() {
  document.getElementById("input-message").replaceChildren();

  document.getElementById("input-modal-form").reset();

  document.getElementById("event-number").replaceChildren();
  document.getElementById("event-selector").style.display = "none";

  document.getElementById("available-views").replaceChildren();
  document.getElementById("input-modal-view-selector").style.display = "none";
}

document
  .getElementById("input-modal-close-button")
  .addEventListener("click", hideInputModal);
