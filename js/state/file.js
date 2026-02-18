import { setEventNumbers } from "./event.js";

const fileData = {
  json: null,
  name: null,
};

export function setFileName(fileName) {
  fileData.name = fileName;
}

export function getFileName() {
  return fileData.name;
}

export function setFileData(jsonData) {
  fileData.json = jsonData;

  const eventNumbers = Object.keys(fileData.json).map((event) =>
    parseInt(event.replace("Event ", "")),
  );

  if (eventNumbers.length === 0) {
    return {
      err: true,
      mgs: "ERROR: No events found in the provided EDM4hep JSON file!",
    };
  }

  setEventNumbers(eventNumbers);

  return { err: false };
}

export function getFileData() {
  return fileData.json;
}
