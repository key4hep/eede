export function parseCharge(charge) {
  if (Math.abs(charge) < 1.0 && charge != 0) {
    if (Math.round(charge * 1000) === 667) {
      return "q = 2/3 e";
    }
    if (Math.round(charge * 1000) === -667) {
      return "q = -2/3 e";
    }
    if (Math.round(charge * 1000) === 333) {
      return "q = 1/3 e";
    }
    if (Math.round(charge * 1000) === -333) {
      return "q = -1/3 e";
    }
  } else {
    return "q = " + charge + " e";
  }
}
