import { PNGDecoder } from "./PNGDecoder";
import { PNGEncoder } from "./PNGEncoder";

export class PNG {
  constructor() {
    let encoder = new PNGEncoder();
    let decoder = new PNGDecoder();
    this.encode = encoder.encode;
    this.decode = decoder.decode;
  }
  public encode: PNGEncoder["encode"];
  public decode: PNGDecoder["decode"];
}