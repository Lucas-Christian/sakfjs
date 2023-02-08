import { z } from "zod";

/**
 * @function isUndefined
 * @description check if something is undefined
 * 
 * @param {undefined} type
 * @returns {Boolean}
 */
export function isUndefined(type: any): boolean {
  return z.undefined().safeParse(type).success;
}