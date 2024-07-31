export const SimStatusBitFieldDisplayValues = {
  "Overlay": 23,
  "Stopped": 24,
  "LeftDetector": 25,
  "DecayedInCalorimeter": 26,
  "DecayedInTracker": 27,
  "VertexIsNotEndpointOfParent": 28,
  "Backscatter": 29,
  "CreatedInSimulation": 30,
};

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
  const values = Object.entries(SimStatusBitFieldDisplayValues);

  return bits.map((bit) => {
    const [value, _] = values.find(([_, v]) => v === bit);

    return value;
  });
}

export function getSimStatusDisplayValuesFromBit(bit) {
  return getSimStatusDisplayValues(parseBits(bit));
}
