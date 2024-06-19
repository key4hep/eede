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
