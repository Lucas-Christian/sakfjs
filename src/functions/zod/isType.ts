import { z } from "zod";

/**
 * @function isString
 * @description check if something is a string
 * 
 * @param {String} type
 * @returns {Boolean}
 */
export function isString(type: string): boolean {
  return z.string().safeParse(type).success;
}

/**
 * @function isNumber
 * @description check if something is a finite number
 * 
 * @param {Number} type
 * @returns {Boolean}
 */
export function isNumber(type: number): boolean {
  return z.number().safeParse(type).success && Number.isFinite(type);
}

/**
 * @function isArray
 * @description check if something is an array
 * 
 * @param {Array<Any>} type
 * @returns {Boolean}
 */
export function isArray(type: any[]): boolean {
  return z.any().array().safeParse(type).success;
}

/**
 * @function isBuffer
 * @description check if something is a buffer
 * 
 * @param {Buffer | string | string[]} type
 * @returns {Boolean}
 */
export function isBuffer(type: string | Buffer | string[]): boolean {
  let isBuffer = Buffer.isBuffer(type) && z.instanceof(Buffer).safeParse(type).success;
  return isBuffer;
}

/**
 * @function isUndefined
 * @description check if something is undefined
 * 
 * @param {undefined} type
 * @returns {Boolean}
 */
export function isUndefined(type: undefined | "undefined"): boolean {
  return z.undefined().safeParse(type).success;
}

/**
 * @function isObject
 * @description check if something is an object
 * 
 * @param {undefined} type
 * @returns {Boolean}
 */
export function isObject(type: {}): boolean {
  return !isBuffer(type as any) && z.object({}).safeParse(type).success;
}