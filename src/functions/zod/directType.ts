import { z } from "zod";

export function isUndefined(type: undefined | "undefined"): boolean {
  return z.undefined().safeParse(type).success;
}