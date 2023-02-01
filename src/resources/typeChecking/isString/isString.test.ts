import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { isString } from "./";
import * as dotenv from "dotenv";
dotenv.config();

describe("#isString", () => {
  const buffer = readFileSync(`${process.env.TESTIMAGEFOLDER}/image2.jpg`);
  test("Verifica se tudo retorna como esperado", () => {
    expect(isString(123 as any)).toBe(false);
    expect(isString("")).toBe(true);
    expect(isString("Hello")).toBe(true);
    expect(isString(["Hello", "World"] as any)).toBe(false);
    expect(isString({"Hello": "World"} as any)).toBe(false);
    expect(isString(null as any)).toBe(false);
    expect(isString(Infinity as any)).toBe(false);
    expect(isString(NaN as any)).toBe(false);
    expect(isString(undefined as any)).toBe(false);
    expect(isString(buffer as any)).toBe(false);
  });
});