const switchDeployButton = document.getElementById("switch-deploy-button");

const url = window.location.href;
if (url.includes("/release")) {
  switchDeployButton.innerText = "Development";
} else {
  switchDeployButton.innerText = "Release";
}

switchDeployButton.addEventListener("click", () => {
  const currentUrl = window.location.href;

  if (currentUrl.includes("/release")) {
    window.location.href = currentUrl.replace("/release", "/main");
  } else {
    window.location.href = "https://key4hep.github.io/eede/release/index.html";
  }
});

export function hideDeploySwitch() {
  const deploySwitch = document.getElementById("switch-deploy");

  deploySwitch.style.display = "none";
}
