import { isASupportedImage } from "@imageManipulation/isASupportedImage";
import { getMIMEType } from "@native/getMIMEType";
import { isString } from "@typeChecking/isString";
import { parse } from "path";

export class Base {
  #buffer: Buffer = undefined as any;
  #path: string = undefined as any;
  #mime: string = undefined as any;

  protected set buffer(buffer: Buffer) {
    this.#buffer = buffer;
  }
  protected set path(imagePath: string) {
    if(!isString(imagePath)) throw new Error("imagePathIsNotSstring");
    this.#path = imagePath;
  }
  protected set mime(imagePath: string) {
    let { ext } = parse(imagePath),
    mime = getMIMEType(ext);
    
    if(!mime || !isASupportedImage(mime)) throw new Error("unsupportedImage");
    this.#mime = mime;
  }

  public get buffer(): Buffer {
    return this.#buffer;
  }
  public get mime(): string {
    return this.#mime; 
  }
  public get path(): string {
    return this.#path;
  }
}