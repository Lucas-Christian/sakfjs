import { RGBPixel } from "../../../Base";

export function calculateYDU(RGB_YUV_TABLE, image: RGBPixel) {
  let { red, green, blue } = image;

  let r = RGB_YUV_TABLE[red],
  g = RGB_YUV_TABLE[(green +  256) >> 0],
  b = RGB_YUV_TABLE[(blue +  512) >> 0];

  return ((r + g + b) >> 16) - 128;
}