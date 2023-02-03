import { RGBPixel, YCbCrPixel } from "../..";

export function RGBToYCbCr({ red, green, blue }: RGBPixel) {
  return {
    Y: calculateY(),
    Cb: calculateCb(),
    Cr: calculateCr()
  } as YCbCrPixel;

  function calculateY() {
    let calculateRed = (red << 6) + (red << 1),
    calculateGreen = (green << 7) + green,
    calculateBlue = (blue << 4) + (blue << 3) + blue;
    return 16 + (calculateRed + calculateGreen + calculateBlue >> 8);
  }
  function calculateCb() {
    let calculateRed = (red << 5) + (red << 2) + (red << 1),
    calculateGreen = (green << 6) + (green << 3) + (green << 1),
    calculateBlue = (blue << 7) - (blue << 4);

    return 128 +((-((calculateRed) - (calculateGreen) + calculateBlue)) >> 8);
  }
  function calculateCr() {
    let calculateRed = (red << 7) - (red << 4),
    calculateGreen = (green << 6) + (green << 5) - (green << 1),
    calculateBlue = (blue << 4) + (blue << 1);

    return 128 + ((calculateRed - (calculateGreen) - (calculateBlue)) >> 8);
  }
}