export function quantizeDCTCoefficients(data, fdtbl) {
  let outputDCT = new Array(64);

  let fDCTQuant;
  for(let i=0; i < 64; ++i) {
    fDCTQuant = data[i]*fdtbl[i];
    outputDCT[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5)|0) : ((fDCTQuant - 0.5)|0);
  }

  return outputDCT;
}