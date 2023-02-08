import { isASupportedImage } from "@imageManipulation/isASupportedImage";
import { getMIMEType } from "@native/getMIMEType";
import { isBuffer } from "@typeChecking/isBuffer";
import { isNumber } from "@typeChecking/isNumber";
import { isObject } from "@typeChecking/isObject";
import { isString } from "@typeChecking/isString";

export type Bitmap = {
  width: number;
  height: number;
  buffer: Buffer | Uint8Array;
}

export class Base {
  #path: string = undefined as any;
  #mime: string = undefined as any;
  #bitmap: Bitmap = undefined as any;

  constructor(path: string) {
    this.path = path;
    this.mime = getMIMEType(this.path);
  }

  private set path(path: string) {
    if(!isString(path)) {
      throw new Error("pathIsNotString");
    }
    this.#path = path;
  }
  private set mime(mime: string) {
    if(!isString(mime)) {
      throw new Error("mimeIsNotString");
    } else if(!isASupportedImage(mime)) {
      throw new Error("unsupportedImage");
    }
    this.#mime = mime;
  }
  
  protected set bitmap(bitmap: Bitmap) {
    if(!isObject(bitmap)) {
      throw new Error("bitmapIsNotObject");
    }
    let { buffer, height, width } = bitmap;
    
    this.buffer = buffer;
    this.height = height;
    this.width = width;
  }
  protected set width(width: number) {
    if(!isNumber(width)) {
      throw new Error("widthIsNotNumber");
    } else if(width < 1 || width > 10000) {
      throw new Error("widthInvalidQuantity");
    }
    this.#bitmap.width = width;
  }
  protected set height(height: number) {
    if(!isNumber(height)) {
      throw new Error("widthIsNotNumber");
    } else if(height < 1 || height > 10000) {
      throw new Error("widthInvalidQuantity");
    }
    this.#bitmap.height = height;
  }
  protected set buffer(buffer: Buffer | Uint8Array) {
    if(!isBuffer(buffer)) {
      throw new Error("bufferIsNotBuffer");
    }
    this.#bitmap.buffer = buffer;
  }

  public get path() {
    return this.#path;
  }
  public get mime() {
    return this.#mime;
  }
  public get bitmap() {
    return this.#bitmap;
  }
}