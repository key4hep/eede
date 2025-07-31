import { getFileName,
         clearAllEventData } from "./globals.js";
import { clearInputModal,
         showInputModal } from "./modals/input.js";

document
    .getElementById("change-file")
    .addEventListener("click", () => {
  clearInputModal();
  clearAllEventData();
  showInputModal();
});

export function updateFileName() {
  const fileName = getFileName();
  const fileNameElem = document.getElementById("current-file-name");
  fileNameElem.textContent = fileName;
}

export function showFileNameMenu() {
  const fileNameMenu = document.getElementById("current-file");
  fileNameMenu.style.display = "flex";
}
