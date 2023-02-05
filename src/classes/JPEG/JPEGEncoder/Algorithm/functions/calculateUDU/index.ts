import { RGBPixel } from "../../../Base";

export function calculateUDU(RGB_YUV_TABLE, image: RGBPixel) {
  let { red, green, blue } = image;

  let r = RGB_YUV_TABLE[(red +  768) >> 0],
  g = RGB_YUV_TABLE[(green + 1024) >> 0], 
  b = RGB_YUV_TABLE[(blue + 1280) >> 0];

  return ((r + g + b) >> 16) - 128;
}
