import type { ImageType } from "../../JPEG/JPEGEncoder/Base";

export class PNGEncoder {
  constructor() {

  }
  encode(image: ImageType, quality: number) {
    return { image: image, quality: quality }
  }
}