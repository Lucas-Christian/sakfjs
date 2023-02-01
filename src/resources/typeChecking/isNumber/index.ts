import { z } from "zod";

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