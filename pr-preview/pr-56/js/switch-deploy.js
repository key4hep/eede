const button = document.getElementById("switch-deploy-button");

button.addEventListener("click", () => {
  const currentUrl = window.location.href;

  if (currentUrl.includes("/release")) {
    window.location.href = currentUrl.replace("/release", "/main");
  } else {
    window.location.href = "https://key4hep.github.io/eede/release/index.html";
  }
});

const url = window.location.href;
if (url.includes("/release")) {
  button.innerText = "Develop";
} else {
  button.innerText = "Release";
}
