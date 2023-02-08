export function interpolate(k: number, kMin: number, vMin: number, kMax: number, vMax: number) {
  // special case - k is integer
  if(kMin === kMax) {
    return vMin;
  }

  return Math.round((k - kMin) * vMax + (kMax - k) * vMin);
};