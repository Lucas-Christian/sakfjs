import { JPEGDecoder } from "./JPEGDecoder";
import { JPEGEncoder } from "./JPEGEncoder";

export class JPEG {
  constructor() {
    let encoder = new JPEGEncoder();
    let decoder = new JPEGDecoder();
    this.encode = encoder.encode;
    this.decode = decoder.decode;
  }
  public encode: JPEGEncoder["encode"];
  public decode: JPEGDecoder["decode"];
}