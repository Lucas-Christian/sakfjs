import type { PathLike } from "fs";
import { instanceOfBuffer, instanceOfNumber } from "../zod/instanceof";
import { readFileSync } from "fs";
import { read, AUTO } from "jimp";

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

  try {
    if(!instanceOfBuffer(buffer)) {
      throw new Error("isn'tBuffer");
    } else if(!instanceOfNumber(quality)) {
      throw new Error("isn'tNumber");
    } else if(quality < 1 || quality > 100) {
      throw new Error("invalidQualityValue");
    }
    
    const image = await read(buffer);
    return await image.quality(quality).getBufferAsync(AUTO as unknown as string);
  } catch(error) {
    throw new Error("unexpectedError");
  }
}