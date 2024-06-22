const infoIcon = document.getElementById("information-icon");
const closeIcon = document.getElementById("close-information");

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
