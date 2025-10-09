import { showInputModal } from './input.js';

export function hideWelcomeModal() {
  const modal = document.getElementById("welcome-modal");

  modal.style.display = "none";
}

export function showWelcomeModal() {
  const modal = document.getElementById("welcome-modal");

  modal.style.display = "block";
}

document
    .getElementById("start-button")
    .addEventListener("click", (event) => {
  event.preventDefault();

  hideWelcomeModal();
  showInputModal();
});
