import { z } from "zod";

/**
 * @function isString
 * @description check if something is a string
 * 
 * @param {String} type
 * @returns {Boolean}
 */
export function isString(type: any): boolean {
  return z.string().safeParse(type).success;
}