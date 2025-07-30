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


/*
 * File
 */
const fileData = {
  json: null,
};

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

export const setCurrentView = (view) => {
  window.sessionStorage.setItem('current-view', view);
};

export const getCurrentView = () => {
  return window.sessionStorage.getItem('current-view');
};

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
