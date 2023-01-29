import type { SupportedMIMEType } from "../../constants/supportedFormats";
import type { PathLike } from "fs";
import { instanceOfBuffer, instanceOfNumber } from "../zod/instanceof";
import { isASupportedImage } from "./isASupportedImage";
import { readFileSync } from "fs";
import { getMIMEType } from "../files/getMIMEType";
import { read, AUTO } from "jimp";


type Options = { width: number, height: number, path: string };

/**
 * @function resizeImage
 * @description change the size of an image(width and height) received as a buffer
 * 
 * @param {PathLike} imagePath
 * @param {Number} width 
 * @param {Number} height
 * @returns {Promise<Buffer>}
 */
export async function resizeImage(imagePath: PathLike, width: number, height: number): Promise<Buffer> {
  try {
    const buffer = readFileSync(imagePath);
    if(!instanceOfBuffer(buffer)) {
      throw new Error("isn'tBuffer");
    }
  
    const type = getMIMEType(imagePath as string);
    
    if(!type || !isASupportedImage(type as SupportedMIMEType)) {
      throw new Error("unsupportedImage");
    } 
    
    if(!instanceOfNumber(width) || !instanceOfNumber(height)) {
      throw new Error("widthOrHeightIsn'tNumber");
    } else if(!Number.isFinite(width)) {
      throw new Error("incorrectWidth");
    } else if(!Number.isFinite(height)) {
      throw new Error("incorrectHeight");
    } else if(width < 1 || width > 10000 || height < 1 || height > 10000) {
      throw new Error("widthOrHeightInvalidQuantity");
    }

    const image = await read(buffer as Buffer);
    return await image.resize(width, height).getBufferAsync(AUTO as unknown as string);
  } catch(error) {
    throw new Error("unexpectedError");
  }
}