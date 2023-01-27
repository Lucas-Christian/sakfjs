import { instanceOfBuffer } from "../zod/instanceof";
import { read } from "jimp";

export async function changeQuality(buffer: string | Buffer | string[], quality: number) {
  try {
    if(!instanceOfBuffer(buffer)) {
      throw new Error("isn'tBuffer");
    }

    const image = await read(buffer as Buffer);
    return image.quality(quality);
  } catch(error) {
    throw new Error("unexpectedError");
  }
}