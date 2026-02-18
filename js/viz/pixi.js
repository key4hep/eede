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
    return false;
  } else {
    return true;
  }
}
