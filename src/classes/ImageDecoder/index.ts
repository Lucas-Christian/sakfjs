import { getImageBuffer } from "../../resources/native/getImageBuffer";
import { JPEGDecoder } from "../JPEG/JPEGDecoder";
import { PNGDecoder } from "../PNG/PNGDecoder";
import { Base } from "./Base";

export class ImageDecoder extends Base {
  constructor(path: string) {
    super(path);
  }
  public async decode() {
    let imageBuffer = await getImageBuffer(this.path);
    const decoders = {
      "image/jpeg": () => {
        let decoder = new JPEGDecoder();
        return decoder.decode(imageBuffer);
      },
      "image/png": () => {
        let decoder = new PNGDecoder();
        return decoder.decode(imageBuffer);
      }
    }
    let decodeImage = decoders[this.mime as keyof typeof decoders],
    decodedImage = decodeImage();

    let { width, height, buffer } = decodedImage;

    let image = {
      width: width,
      height: height,
      buffer: buffer
    }
    this.bitmap = image;

    return image;
  }
}