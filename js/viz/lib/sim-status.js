import { SimStatusBitFieldDisplayValues } from "../constants/sim-status.js";

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
    if (bit in SimStatusBitFieldDisplayValues) {
      statuses.push(SimStatusBitFieldDisplayValues[bit]);
    }
  });

  return statuses;
}

export function getSimStatusDisplayValuesFromBit(bit) {
  return getSimStatusDisplayValues(parseBits(bit));
}
