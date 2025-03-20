export const SimStatusBitFieldDisplayValues = {
  23: "Overlay",
  24: "Stopped",
  25: "LeftDetector",
  26: "DecayedInCalorimeter",
  27: "DecayedInTracker",
  28: "VertexIsNotEndpointOfParent",
  29: "Backscatter",
  30: "CreatedInSimulation",
  31: "Endpoint", // Possible in LCIO
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
