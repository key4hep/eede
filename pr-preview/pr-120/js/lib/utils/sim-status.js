import { simStatusBitFieldDisplayValues } from "../constants/simStatus.js";

export function getSimStatusDisplayValuesFromBit(bit) {
  const statuses = [];

  for (let i = 0; i < 32; i++) {
    if (bit & (1 << i) && i in simStatusBitFieldDisplayValues) {
      statuses.push(simStatusBitFieldDisplayValues[i]);
    }
  }

  return statuses;
}
