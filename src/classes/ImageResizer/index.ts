import { resizeOperations } from "./resizeOperations";
import { isUndefined } from "../../resources/typeChecking/isUndefined";
import { isNumber } from "../../resources/typeChecking/isNumber";
import { Resize } from "./Resize";
import { Base } from "./Base";
import { ImageDecoder } from "../ImageDecoder";

export const AUTO = -1;

type ResizeMode = "nearestNeighbor" | 
"bilinearInterpolation" | "bicubicInterpolation" | 
"hermiteInterpolation" | "bezierInterpolation";

export class ImageResizer extends Base {
  constructor(path: string) {
    super(path);
  }
  /**
   * Resizes the image to a set width and height using a 2-pass bilinear algorithm
   * @param {number} width the width to resize the image to (or Jimp.AUTO)
   * @param {number} height the height to resize the image to (or Jimp.AUTO)
   * @param {string} mode (optional) a scaling method (e.g. Jimp.RESIZE_BEZIER)
   */
  async resize(width: number, height: number, mode?: ResizeMode) {
    let decoder = new ImageDecoder(this.path);
    let decodedImage = await decoder.decode();

    this.bitmap.width = decodedImage.width;
    this.bitmap.height = decodedImage.height;
    this.bitmap.buffer = decodedImage.buffer;

    if(!isNumber(width) || !isNumber(height)) {
      throw new Error("widthOrHeightIsNotNumber");
    } else if(width === AUTO && height === AUTO) {
      throw new Error("widthAndHeightBothAuto");
    }
    if(width === AUTO) {
      width = this.bitmap.width * (height / this.bitmap.height);
    } else if(height === AUTO) {
      height = this.bitmap.height * (width / this.bitmap.width);
    } 
    if(width < 1 || width > 10000 || height < 1 || height > 10000) {
      throw new Error("widthOrHeightInvalidQuantity");
    }

    // round inputs
    width = Math.round(width);
    height = Math.round(height);

    if(!isUndefined(resizeOperations[mode!])) {
      const dst = {
        buffer: Buffer.alloc(width * height * 4),
        width: width,
        height: height,
      };
      resizeOperations[mode!](this.bitmap, dst);
      this.bitmap = dst;
    } else {
      const resize = new Resize(
        this.bitmap.width,
        this.bitmap.height,
        width,
        height,
        true,
        true,
        (buffer: Buffer) => {
          let image = {
            buffer: Buffer.from(buffer),
            width: width,
            height: height
          }
          this.bitmap = image;
        }
      );
      resize.resize(this.bitmap.buffer);
    }
    return this.bitmap;
  }
};
