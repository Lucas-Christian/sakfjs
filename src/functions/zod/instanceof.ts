import { z } from "zod";

/**
 * @function instanceOfString
 * @description check if something is instanceof string
 * 
 * @param {String} type
 * @returns {Boolean}
 */
export function instanceOfString(type: string): boolean {
  return z.instanceof(String).safeParse(type).success;
}

/**
 * @function instanceOfNumber
 * @description check if something is instanceof number
 * 
 * @param {Number} type
 * @returns {Boolean}
 */
export function instanceOfNumber(type: number): boolean {
  return z.instanceof(Number).safeParse(type).success;
}

/**
 * @function instanceOfArray
 * @description check if something is instanceof array
 * 
 * @param {Array<Any>} type
 * @returns {Boolean}
 */
export function instanceOfArray(type: any[]): boolean {
  return z.instanceof(Array).safeParse(type).success;
}

/**
 * @function instanceOfBuffer
 * @description check if something is instanceof buffer
 * 
 * @param {Buffer | string | string[]} type
 * @returns {Boolean}
 */
export function instanceOfBuffer(type: string | Buffer | string[]): boolean {
  let isBuffer = Buffer.isBuffer(type) && z.instanceof(Buffer).safeParse(type).success;
  return isBuffer;
}