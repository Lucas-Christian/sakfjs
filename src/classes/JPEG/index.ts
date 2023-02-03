import { decode } from "./decode";
import { encode } from "./encode";

export class JPEG {
  public encode = encode;
  public decode = decode;
}