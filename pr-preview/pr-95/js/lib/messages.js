export function infoMsg(msg) {
  const msgDiv = document.getElementById("input-message");
  msgDiv.classList.add("mb-20");
  msgDiv.style.color = "gray";
  msgDiv.innerHTML = "<p>INFO: " + msg + "</p>";
}

export function errorMsg(msg) {
  const msgDiv = document.getElementById("input-message");
  msgDiv.classList.add("mb-20");
  msgDiv.style.color = "red";
  msgDiv.innerHTML = "<p>ERROR: " + msg + "</p>";
}

export function emptyViewMessage() {
  const msgDiv = document.getElementById("information-message-modal");
  msgDiv.style.display = "flex";

  const msgText = document.getElementById("information-text");
  msgText.innerText = "This view has no elements";
}

export function hideEmptyViewMessage() {
  const msgDiv = document.getElementById("information-message-modal");
  msgDiv.style.display = "none";
}

export function showMessage(message) {
  const msgDiv = document.getElementById("information-message-modal");
  msgDiv.style.display = "flex";

  const msgText = document.getElementById("information-text");
  msgText.innerText = message;

  setTimeout(() => {
    msgDiv.style.display = "none";
  }, 2000);
}
