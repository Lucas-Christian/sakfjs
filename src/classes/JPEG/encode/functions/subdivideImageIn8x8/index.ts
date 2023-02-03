import { RGBPixel, YCbCrPixel } from "../..";
import { RGBToYCbCr } from "../RGBToYCbCr";

export function subdivideImageIn8x8(buffer: Buffer) {
  let pixelBlocks8x8: YCbCrPixel[][][] = [],
  pixelBlockColumns: YCbCrPixel[][] = [],
  pixelBlockLine: YCbCrPixel[] = [];

  let rowPosition = 0, column = 0;

  for(let i = 0;i <= buffer.length;i = i+4) {
    if(rowPosition === 8) {
      pixelBlockColumns.push(pixelBlockLine);
      pixelBlockLine = [];
      rowPosition = 0;
      column++;
    }
    if(column === 8 || i >= buffer.length) {
      pixelBlocks8x8.push(pixelBlockColumns);
      pixelBlockColumns = [];
      pixelBlockLine = [];
      rowPosition = 0;
      column = 0;
    }
    
    let rgbPixel = {
      red: buffer[i],
      green: buffer[i + 1],
      blue: buffer[i + 2]
    } as RGBPixel;

    let yCbCrPixel = RGBToYCbCr(rgbPixel);
    pixelBlockLine.push(yCbCrPixel);
    rowPosition++;
  }

  return pixelBlocks8x8;
}