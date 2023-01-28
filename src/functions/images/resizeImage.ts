import type { SupportedMIMEType } from "../../types/SupportedMIMEType";
import { instanceOfBuffer, instanceOfNumber } from "../zod/instanceof";
import { isASupportedImage } from "./isASupportedImage";
import { getMIMEType } from "../files/getMIMEType";
import { read, AUTO } from "jimp";

type Options = { width: number, height: number, path: string };

export async function resizeImage(buffer: string | Buffer | string[], { path, width, height }: Options): Promise<Buffer> {
  try {
    if(!instanceOfBuffer(buffer)) {
      throw new Error("isn'tBuffer");
    }
  
    const type = getMIMEType(path);
    
    if(!type || !isASupportedImage(type as SupportedMIMEType)) {
      throw new Error("unsupportedImage");
    } else if(!Number.isFinite(width)) {
      throw new Error("incorrectWidth");
    } else if(!Number.isFinite(height)) {
      throw new Error("incorrectHeight");
    }
  
    const image = await read(buffer as Buffer);
  
    if(!instanceOfNumber(width)) {
      width = Math.trunc(
        image.bitmap.width * (height / image.bitmap.height)
      );
    } else if(!instanceOfNumber(height)) {
      height = Math.trunc(
        image.bitmap.height * (width / image.bitmap.width)
      );
    }
  
    return await image.resize(width, height).getBufferAsync(AUTO as unknown as string);
  } catch(error) {
    throw new Error("unexpectedError");
  }
}