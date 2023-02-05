import { RGBPixel } from "../../../Base";

export function calculateVDU(RGB_YUV_TABLE, image: RGBPixel) {
  let { red, green, blue } = image;

  let r = RGB_YUV_TABLE[(red + 1280) >> 0], 
  g = RGB_YUV_TABLE[(green + 1536) >> 0], 
  b = RGB_YUV_TABLE[(blue + 1792) >> 0];

  return ((r + g + b) >> 16) - 128;
}