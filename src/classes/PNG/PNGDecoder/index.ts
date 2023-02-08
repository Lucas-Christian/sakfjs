export class PNGDecoder {
  constructor() {

  }
  decode(buffer: Buffer) {
    return { width: 1, height: 1, buffer: buffer };
  }
}