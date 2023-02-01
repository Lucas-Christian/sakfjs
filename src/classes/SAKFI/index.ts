import { isASupportedImage } from "../supportedImages/isASupportedImage/isASupportedImage";
import { loadImageBuffer } from "./loadImageBuffer/loadImageBuffer";
import { getMIMEType } from "../../files/getMIMEType";
import { isString } from "../../zod/isString";
import { parse } from "path";

export class SakfImage {
  #mime = "image/jpeg";
  #buffer: Buffer;

  constructor(path: string) {
    let { ext } = parse(path),
    mime = getMIMEType(ext);

    if(!mime || !isASupportedImage(mime)) throw new Error("unsupportedImage");
    this.#mime = mime;

  }

  async loadBuffer(imagePath: string) {
    if(isString(imagePath as string)) {
      this.#buffer = await loadImageBuffer(imagePath);
    }
  }
  deleteBuffer() {
    this.#buffer = undefined as any;
  }

  public get buffer(): Buffer {
    return this.#buffer;
  }
  public get mime(): string {
    return this.#mime; 
  }
}