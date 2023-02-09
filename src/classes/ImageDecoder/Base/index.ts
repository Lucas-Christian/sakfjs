import { isASupportedImage } from "../../../resources/imageManipulation/isASupportedImage";
import { getMIMEType } from "../../../resources/native/getMIMEType";
import { isBuffer } from "../../../resources/typeChecking/isBuffer";
import { isNumber } from "../../../resources/typeChecking/isNumber";
import { isObject } from "../../../resources/typeChecking/isObject";
import { isString } from "../../../resources/typeChecking/isString";

export type Bitmap = {
  width: number;
  height: number;
  buffer: Buffer | Uint8Array;
}

export class Base {
  #path: string = undefined as any;
  #mime: string = undefined as any;
  #bitmap: Bitmap = {
    buffer: undefined as any,
    height: undefined as any,
    width: undefined as any
  }

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
    
    if(!isBuffer(buffer)) {
      throw new Error("bufferIsNotBuffer");
    }
    if(!isNumber(height)) {
      throw new Error("widthIsNotNumber");
    } else if(height < 1 || height > 10000) {
      throw new Error("widthInvalidQuantity");
    }
    if(!isNumber(width)) {
      throw new Error("widthIsNotNumber");
    } else if(width < 1 || width > 10000) {
      throw new Error("widthInvalidQuantity");
    }
    
    this.#bitmap = bitmap;
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
  public get buffer() {
    return this.#bitmap.buffer;
  }
  public get width() {
    return this.#bitmap.width;
  }
  public get height() {
    return this.#bitmap.height;
  }
}