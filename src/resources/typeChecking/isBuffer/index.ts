import { z } from "zod";

/**
 * @function isBuffer
 * @description check if something is a buffer
 * 
 * @param {Buffer | string | string[]} type
 * @returns {Boolean}
 */
export function isBuffer(type: string | Buffer | string[]): boolean {
  return Buffer.isBuffer(type) && z.instanceof(Buffer).safeParse(type).success;
}