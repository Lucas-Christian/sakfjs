import { z } from "zod";

/**
 * @function isArray
 * @description check if something is an array
 * 
 * @param {Array<Any>} type
 * @returns {Boolean}
 */
export function isArray(type: any): boolean {
  return z.any().array().safeParse(type).success;
}