import { isBuffer } from "../isBuffer";
import { z } from "zod";

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