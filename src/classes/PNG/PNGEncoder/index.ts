import type { ImageType } from "@classes/JPEG/JPEGEncoder/Base";

export class PNGEncoder {
  constructor() {

  }
  encode(image: ImageType, quality: number) {
    return { image: image, quality: quality }
  }
}