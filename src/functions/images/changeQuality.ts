import type { SupportedMIMEType } from "../../constants/supportedFormats";
import type { PathLike } from "fs";
import { isASupportedImage } from "./isASupportedImage";
import { readFileSync } from "fs";
import { getMIMEType } from "../files/getMIMEType";
import { read, AUTO } from "jimp";
import { isBuffer } from "../zod/isBuffer";
import { isNumber } from "../zod/isNumber";

/**
 * @function changeQuality
 * @description change the quality of an image(1 - 100) received as a buffer
 * 
 * @param {PathLike} imagePath
 * @param {Number} quality
 * @returns {Promise<Buffer>}
 */
export async function changeQuality(imagePath: PathLike, quality: number): Promise<Buffer> {
  const buffer = readFileSync(imagePath);
  if(!isBuffer(buffer) || buffer.length === 0) {
    throw new Error("pathDoesNotLeadToBuffer");
  }

  const type = getMIMEType(imagePath as string);
  if(!type || !isASupportedImage(type as SupportedMIMEType)) {
    throw new Error("unsupportedImage");
  }

  if(!isNumber(quality)) {
    throw new Error("isNotNumber");
  } else if(quality < 1 || quality > 100) {
    throw new Error("invalidQualityValue");
  }
  
  try {
    const image = await read(buffer);
    return await image.quality(quality).getBufferAsync(AUTO as unknown as string);
  } catch(error) {
    throw error;
  }
}