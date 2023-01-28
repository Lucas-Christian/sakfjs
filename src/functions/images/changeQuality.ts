import { instanceOfBuffer } from "../zod/instanceof";
import { read, AUTO } from "jimp";

export async function changeQuality(buffer: string | Buffer | string[], quality: number): Promise<Buffer> {
  try {
    if(!instanceOfBuffer(buffer)) {
      throw new Error("isn'tBuffer");
    }

    const image = await read(buffer as Buffer);
    return await image.quality(quality).getBufferAsync(AUTO as unknown as string);
  } catch(error) {
    throw new Error("unexpectedError");
  }
}