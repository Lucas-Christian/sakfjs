import { z } from "zod";

export function instanceOfString(type: string): boolean {
  return z.instanceof(String).safeParse(type).success;
}
export function instanceOfNumber(type: number): boolean {
  return z.instanceof(Number).safeParse(type).success;
}
export function instanceOfArray(type: any[]): boolean {
  return z.instanceof(Array).safeParse(type).success;
}
export function instanceOfBuffer(type: string | Buffer | string[]): boolean {
  let isBuffer = Buffer.isBuffer(type) && z.instanceof(Buffer).safeParse(type).success;
  return isBuffer;
}