/*
 * Pixi state
 */
const pixiState = {
  app: null,
  container: null,
  width: NaN,
  height: NaN,
};

export function getPixiState() {
  return pixiState;
}

export function isPixiRunning() {
  if (pixiState.app === null) {
    return false
  } else {
    return true
  }
}


/*
 * File
 */
const fileData = {
  json: null,
  name: null
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
    parseInt(event.replace("Event ", ""))
  );

  if (eventNumbers.length === 0) {
    return {'err': true,
            'mgs': 'ERROR: No events found in the provided EDM4hep JSON file!'};
  }

  setEventNumbers(eventNumbers);

  return {'err': false}
}

export function getFileData() {
  return fileData.json;
}


/*
 * Event
 */
export const eventCollection = {}; // store all events info (gradually store data for each event)
export const currentObjects = {}; // store data (objects) for current event number

export function getEventNumbers() {
  const eventNumbersString = window.sessionStorage.getItem('event-numbers');
  return JSON.parse(eventNumbersString);
}

export function setEventNumbers(eventNumbers) {
  window.sessionStorage.setItem('event-numbers',
                                JSON.stringify(eventNumbers));
}

export function getEventIndex(eventNumber) {
  const eventNumbers = getEventNumbers();
  return eventNumbers.findIndex((elem) => elem === Number(eventNumber));
}

export function setCurrentEventIndex(index) {
  return Number(window.sessionStorage.setItem('current-event-index', index));
}

export function getCurrentEventIndex() {
  return Number(window.sessionStorage.getItem('current-event-index'));
}

export function getCurrentEventNumber() {
  const currentEventIndex = getCurrentEventIndex();
  const eventNumbers = getEventNumbers();
  return eventNumbers[currentEventIndex];
}

export function getCurrentEventName() {
  return `Event ${getCurrentEventNumber()}`;
}

/*
 * View
 */
const scrollPositions = {};

export function setCurrentView(viewName) {
  window.sessionStorage.setItem('current-view', viewName);
}

export function getCurrentView() {
  return window.sessionStorage.getItem('current-view');
}

function getViewScrollIndex() {
  return `${getCurrentEventIndex()}-${getCurrentView()}`;
}

export function saveCurrentScrollPosition(position) {
  const scrollIndex = getViewScrollIndex();

  if (position === undefined) {
    return;
  }

  if (position === null) {
    return;
  }

  scrollPositions[scrollIndex] = {
    x: position.x,
    y: position.y,
  };
}

export function getSavedScrollPosition() {
  const scrollIndex = getViewScrollIndex();
  return scrollPositions[scrollIndex];
}

export function clearScrollPositions() {
  Object.keys(scrollPositions).forEach((key) => {
    delete scrollPositions[key];
  });
}


/*
 * Clearings
 */
export function clearAllEventData() {
  window.sessionStorage.clear();

  Object.keys(eventCollection).forEach((key) => {
    delete eventCollection[key];
  });

  clearScrollPositions();
}
