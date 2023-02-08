import { JPEGDecoder } from "@classes/JPEG/JPEGDecoder";
import { PNGDecoder } from "@classes/PNG/PNGDecoder";
import { getImageBuffer } from "@native/getImageBuffer";
import { Base } from "./Base";

export class ImageDecoder extends Base {
  constructor(path: string) {
    super(path);
    this.decode();
  }
  private async decode() {
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
    this.width = width;
    this.height = height;
    this.buffer = buffer;
  }
}