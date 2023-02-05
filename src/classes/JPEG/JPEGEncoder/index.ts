import { END_OF_IMAGE, START_OF_IMAGE } from "./constants/headers";
import { ImageType, Algorithm } from "./Algorithm";
import { isUndefined } from "../../../resources/typeChecking/isUndefined";
import { isBuffer } from "../../../resources/typeChecking/isBuffer";
import { isNumber } from "../../../resources/typeChecking/isNumber";
import { isObject } from "../../../resources/typeChecking/isObject";

export class JPEGEncoder extends Algorithm {
  constructor() {
    super();
  }
  
  /**
   * @function encode
   * @description this function encode a image to the format
   * [JPEG](https://raw.githubusercontent.com/LordLuch/images/main/ImageCompression/JPEG/jpeg.png)
   */
  public encode(image: ImageType, quality: number = 50) {
    if(!isNumber(quality)) throw new Error("invalidQuality");
    else if(quality <= 0 || quality > 100) throw new Error("invalidQuality");
    else if(!isObject(image)) throw new Error("invalidImage");
    let { width, height, buffer } = image;
  
    this.setQuality(quality);

    if(!isBuffer(buffer)) throw new Error("invalidImageBuffer");
    else if(!isNumber(width) || !isNumber(height)) throw new Error("widthOrHeightIsNotNumber");
    else if(width < 8 || width > 10000) throw new Error("widthInvalidQuantity");
    else if(height < 8 || height > 10000) throw new Error("HeightInvalidQuantity");

    this.writeWord(START_OF_IMAGE);
    this.writeJPEGHeaders(image);
    this.writeImageData(image);
    this.writeWord(END_OF_IMAGE);

    if(isUndefined(module as any)) return new Uint8Array(this.byteOut);
    return Buffer.from(this.byteOut);
  }
}