import { instanceOfBuffer, instanceOfNumber } from "../zod/instanceof";
import { read, AUTO } from "jimp";

/**
 * @function changeQuality
 * @description change the quality of an image(1 - 100) received as a buffer
 * 
 * @param {Buffer | string | string[]} buffer
 * @param {Number} quality
 * @returns {Promise<Buffer>}
 */
export async function changeQuality(buffer: string | Buffer | string[], quality: number): Promise<Buffer> {
  try {
    if(!instanceOfBuffer(buffer)) {
      throw new Error("isn'tBuffer");
    } else if(!instanceOfNumber(quality)) {
      throw new Error("isn'tNumber");
    } else if(quality < 1 || quality > 100) {
      throw new Error("invalidQualityValue");
    }
    
    const image = await read(buffer as Buffer);
    return await image.quality(quality).getBufferAsync(AUTO as unknown as string);
  } catch(error) {
    throw new Error("unexpectedError");
  }
}