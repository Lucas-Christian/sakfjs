import { organizeQuantizedCoefficients } from "./functions/organizeQuantizedCoefficients";
import { quantizeDCTCoefficients } from "./functions/quantizeDCTCoefficients";
import { subdivideImageIn8x8 } from "./functions/subdivideImageIn8x8";
import { runLengthEncoding } from "./functions/runLengthEncoding";
import { huffmanEncoding } from "./functions/huffmanEncoding";
import { deltaEncoding } from "./functions/deltaEncoding";
import { calculateDCT } from "./functions/calculateDCT";
import { isBuffer } from "../../../resources/typeChecking/isBuffer";
import { isNumber } from "../../../resources/typeChecking/isNumber";
import { isObject } from "../../../resources/typeChecking/isObject";

export type ImageType = { buffer: Buffer, width: number, height: number };
export type RGBPixel = { red: number, green: number, blue: number };
export type YCbCrPixel = { Y: number, Cb: number, Cr: number };

export function encode(image: ImageType, quality: number = 50) {
  if(!isNumber(quality)) throw new Error("invalidQuality");
  else if(quality <= 0 || quality > 100) throw new Error("invalidQuality");
  else if(!isObject(image)) throw new Error("invalidImage");
  let { width, height, buffer } = image;

  if(!isBuffer(buffer)) throw new Error("invalidImageBuffer");
  else if(!isNumber(width) || !isNumber(height)) throw new Error("widthOrHeightIsNotNumber");
  else if(width < 8 || width > 10000) throw new Error("widthInvalidQuantity");
  else if(height < 8 || height > 10000) throw new Error("HeightInvalidQuantity");

  let pixelBlocks8x8 = subdivideImageIn8x8(buffer);
  pixelBlocks8x8.forEach((pixelBlock) => {
    let DCTCoefficients = calculateDCT(pixelBlock);

    return;
    quantizedDCTCoefficients = quantizeDCTCoefficients(DCTCoefficients),
    organizedQuantizedCoefficients = organizeQuantizedCoefficients(quantizedDCTCoefficients);

    let coefficients = deltaEncoding(organizedQuantizedCoefficients);

    coefficients = runLengthEncoding(coefficients);

    let encodedCoefficients = huffmanEncoding(coefficients);

    encodedImage.write(encodedCoefficients);
  });
  return;

  return encodedImage;
}