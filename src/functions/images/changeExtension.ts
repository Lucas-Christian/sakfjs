import type { SupportedExt } from "../../constants/supportedFormats";
import type { PathLike } from "fs";
import { isASupportedImage } from "./isASupportedImage";
import { supportedFormats } from "../../constants/supportedFormats";
import { instanceOfBuffer } from "../zod/instanceof";
import { readFileSync } from "fs";
import { read } from "jimp";

/**
 * @function changeExtension
 * @description change the extension of an image(jpg or png) received as a buffer
 * 
 * @param {PathLike} imagePath
 * @param {String} ext
 * @returns {Promise<Buffer>}
 */

export async function changeExtension(imagePath: PathLike, ext: SupportedExt): Promise<Buffer> {
  try {
    const buffer = readFileSync(imagePath);

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