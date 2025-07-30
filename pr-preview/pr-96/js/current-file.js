import { eventCollection, renderEvent } from "./event-number.js";
import { selectViewInformation } from "./information.js";
import { showMessage, errorMsg } from "./lib/messages.js";
import { clearScrollPositions } from "./globals.js";
import { setFileData,
         setCurrentEventIndex,
         getCurrentEventIndex,
         getEventNumbers } from "./globals.js"

const fileInput = document.getElementById("change-file-input");

fileInput.addEventListener("change", (event) => {
  for (const file of event.target.files) {
    if (!file.name.endsWith("edm4hep.json")) {
      showMessage("ERROR: Provided file is not EDM4hep JSON!");
      return;
    }

    if (!file.type.endsWith("/json")) {
      showMessage("ERROR: Provided file is not JSON!");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const fileText = event.target.result;
      let ret = setFileData(JSON.parse(fileText));

      if (ret.err === true) {
        errorMsg(ret.msg);
        return;
      }

      setCurrentEventIndex(0);

      clearAllData();
      selectViewInformation();
      renderEvent(getCurrentEventIndex());

      const eventSelectorMenu = document.getElementById("event-selector-menu");
      eventSelectorMenu.replaceChildren();

      getEventNumbers().forEach((option) => {
        const optionElementMenu = document.createElement("div");
        optionElementMenu.className = "event-option";
        optionElementMenu.appendChild(document.createTextNode(option));
        eventSelectorMenu.appendChild(optionElementMenu);
        optionElementMenu.addEventListener("click", () => {
          renderEvent(option);
          eventSelectorMenu.style.display = "none";
        });
      });
    });

    reader.readAsText(file);
    break;
  }
});

function clearAllData() {
  Object.keys(eventCollection).forEach((key) => {
    delete eventCollection[key];
  });

  clearScrollPositions();
}

function handleFileInput() {
  fileInput.click();
}

const button = document.getElementById("change-file");
button.addEventListener("click", handleFileInput);

export function setFileName(name) {
  const fileName = document.getElementById("current-file-name");
  fileName.textContent = name;
  window.sessionStorage.setItem('current-file-name', name);
}

export function showFileNameMenu() {
  const fileNameMenu = document.getElementById("current-file");
  fileNameMenu.style.display = "flex";
}
