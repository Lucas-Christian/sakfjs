import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { isArray } from "./";
import * as dotenv from "dotenv";
dotenv.config();

describe("#isArray", () => {
  const buffer = readFileSync(`${process.env.TESTIMAGEFOLDER}/image2.jpg`);
  test("Verifica se tudo retorna como esperado", () => {
    expect(isArray(123 as any)).toBe(false);
    expect(isArray("" as any)).toBe(false);
    expect(isArray("Hello" as any)).toBe(false);
    expect(isArray(["Hello", "World"] as any)).toBe(true);
    expect(isArray({"Hello": "World"} as any)).toBe(false);
    expect(isArray(null as any)).toBe(false);
    expect(isArray(Infinity as any)).toBe(false);
    expect(isArray(NaN as any)).toBe(false);
    expect(isArray(undefined as any)).toBe(false);
    expect(isArray(buffer as any)).toBe(false);
  });
});