const infoIcon = document.getElementById("information-icon");
const closeIcon = document.getElementById("close-information");
const copyToClipboardButtons =
  document.getElementsByClassName("copy-email-button");

Array.from(copyToClipboardButtons).forEach((button) => {
  button.addEventListener("click", () => {
    const email = button.getAttribute("data-email");
    copyEmailAddress(email)
      .then(() => {
        showCopyInfo(button, "Copied!");
      })
      .catch((error) => {
        showCopyInfo(button, "Error!");
        console.error("Failed to copy email address: ", error);
      });
  });
});

function showCopyInfo(button, message) {
  const copyDiv = document.createElement("div");
  copyDiv.className = "copy-infobox";
  copyDiv.appendChild(document.createTextNode(message));
  button.appendChild(copyDiv);
  setTimeout(() => {
    button.removeChild(copyDiv);
  }, 500);
}

function copyEmailAddress(address) {
  return navigator.clipboard.writeText(address);
}

const showModal = () => {
  const modal = document.getElementById("information-modal");
  modal.style.display = "flex";
};

const hideModal = () => {
  const modal = document.getElementById("information-modal");
  modal.style.display = "none";
};

infoIcon.addEventListener("click", showModal);
closeIcon.addEventListener("click", hideModal);

window.addEventListener("click", (event) => {
  const modal = document.getElementById("information-modal");

  if (
    event.target !== modal &&
    !modal.contains(event.target) &&
    event.target !== infoIcon &&
    modal.style.display === "flex"
  ) {
    hideModal();
  }
});
