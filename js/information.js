const infoIcon = document.getElementById("information-icon");
const closeIcon = document.getElementById("close-information");
const copyToClipboardButtons =
  document.getElementsByClassName("copy-email-button");
const informationButton = document.getElementById("information-button");
const viewButton = document.getElementById("view-information-button");

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

function chooseButton(id) {
  const buttons = document.getElementsByClassName("information-button");
  Array.from(buttons).forEach((button) => {
    if (button.id === id) {
      button.style.backgroundColor = "#c5c5c5";
    } else {
      button.style.backgroundColor = "#ffffff";
    }
  });
}

function showOption(id) {
  const informationOptions = document.getElementById("information-options");
  const children = informationOptions.children;
  Array.from(children).forEach((child) => {
    if (child.id === id) {
      child.style.display = "block";
    } else {
      child.style.display = "none";
    }
  });
}

export function selectInformationSection() {
  chooseButton("information-button");
  showOption("information-content");
}

export function selectViewInformation() {
  chooseButton("view-information-button");
  showOption("view-information-content");
}

informationButton.addEventListener("click", selectInformationSection);

viewButton.addEventListener("click", selectViewInformation);

export function showViewInformation(title, description) {
  if (viewButton.style.display !== "block") {
    viewButton.style.display = "block";
  }

  const viewTitle = document.getElementById("view-title-info");
  viewTitle.innerText = `Learn more about ${title} view`;

  const viewDescription = document.getElementById("view-description-info");
  viewDescription.replaceChildren();
  const newElement = document.createElement("div");
  newElement.innerHTML = description;
  viewDescription.appendChild(newElement.firstChild);
}

export function hideViewInformation() {
  viewButton.style.display = "none";
}
