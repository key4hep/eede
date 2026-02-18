import { simStatusBitFieldDisplayValues } from "../constants/simStatus.js";

export function parseBits(bit) {
  const bits = [];

  for (let i = 0; i < 32; i++) {
    if (bit & (1 << i)) {
      bits.push(i);
    }
  }

  return bits;
}

export function getSimStatusDisplayValues(bits) {
  const statuses = [];

  bits.forEach((bit) => {
    if (bit in simStatusBitFieldDisplayValues) {
      statuses.push(simStatusBitFieldDisplayValues[bit]);
    }
  });

  return statuses;
}

export function getSimStatusDisplayValuesFromBit(bit) {
  return getSimStatusDisplayValues(parseBits(bit));
}
