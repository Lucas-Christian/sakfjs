import type { SupportedExt, SupportedMIMEType } from "../../../../constants/supportedFormats";
import type { PathLike } from "fs";
import { isASupportedImage } from "../../supportedImages/isASupportedImage/isASupportedImage";
import { getExtensions } from "../../../files/getExtensions";
import { readFileSync } from "fs";
import { getMIMEType } from "../../../files/getMIMEType";
import { isBuffer } from "../../../zod/isBuffer";
import { read } from "jimp";

/**
 * @function changeExtension
 * @description change the extension of an image(jpg or png) received as a buffer
 * 
 * @param {PathLike} imagePath
 * @param {String} ext
 * @returns {Promise<Buffer>}
 */

export async function changeExtension(imagePath: PathLike, extOrMIMEType: SupportedExt | SupportedMIMEType): Promise<Buffer> {
  let buffer = readFileSync(imagePath);

  if(!isBuffer(buffer) || buffer.length === 0) {
    throw new Error("pathDoesNotLeadToBuffer");
  } else if(!extOrMIMEType || !isASupportedImage(extOrMIMEType)) {
    throw new Error("unsupportedImage");
  }

  try {
    const image = await read(buffer as Buffer);
    if(getExtensions(extOrMIMEType)) {
      return await image.getBufferAsync(extOrMIMEType);
    }

    const mime = getMIMEType(extOrMIMEType) || "image/jpeg";
    
    return await image.getBufferAsync(mime);
  } catch(error) {
    throw error;
  }
}