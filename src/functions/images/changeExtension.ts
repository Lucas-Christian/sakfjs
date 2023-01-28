import type { SupportedExt } from "../../types/SupportedExt";
import { isASupportedImage } from "./isASupportedImage";
import { supportedFormats } from "../../constants/supportedFormats";
import { instanceOfBuffer } from "../zod/instanceof";
import { read } from "jimp";

export async function changeExtension(buffer: string | Buffer | string[], ext: SupportedExt): Promise<Buffer> {
  try {
    if(!instanceOfBuffer(buffer)) {
      throw new Error("isn'tBuffer");
    } else if(!ext || !isASupportedImage(ext)) {
      throw new Error("unsupportedImage");
    }

    const image = await read(buffer as Buffer),  
    mime = supportedFormats[ext as SupportedExt] || "image/jpeg";

    return await image.getBufferAsync(mime);
  } catch(error) {
    throw new Error("unexpectedError");
  }
}